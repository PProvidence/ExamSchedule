import { connection } from "../config/config";

export const createExamSlotWithBatches = async (
  courseId: number,
  startDate: Date,
  endDate: Date,
  physicalCapacity: number,
  batchDurationMinutes = 60,
  breakStartHour = 13,
  breakEndHour = 14,
  batchGapMinutes = 30
) => {
  const client = await connection.connect();

  try {
    await client.query("BEGIN");

    // 1) Try to find the most recent slot linked to this course
    const existingSlotRes = await client.query(
      `SELECT es.id, es.startdate, es.enddate
       FROM course_slot cs
       JOIN exam_slot es ON cs.slot_id = es.id
       WHERE cs.course_id = $1
       ORDER BY es.startdate DESC
       LIMIT 1`,
      [courseId]
    );

    let slotId: number | null = null;
    let action: "created" | "updated" = "created";

    if (existingSlotRes.rowCount! > 0) {
      // Found existing slot
      slotId = existingSlotRes.rows[0].id as number;

      // 2) Check if students are scheduled for this slot
      const scheduledCountRes = await client.query(
        `SELECT COUNT(*)::int AS total FROM student_schedule WHERE slot_id = $1`,
        [slotId]
      );
      const scheduledCount = parseInt(scheduledCountRes.rows[0].total, 10);

      if (scheduledCount > 0) {
        // Safety: we don't overwrite slot that already has students scheduled
        throw new Error(
          `Cannot update slot ${slotId}: ${scheduledCount} students are already scheduled. ` +
            `Please reschedule students or use the admin reschedule flow before updating the slot.`
        );
      }

      // 3) Update exam_slot
      await client.query(
        `UPDATE exam_slot SET startdate = $1, enddate = $2, physical_capacity = $3
         WHERE id = $4`,
        [startDate, endDate, physicalCapacity, slotId]
      );

      // 4) Delete existing batches for that slot (safe because no students scheduled)
      await client.query(`DELETE FROM exam_batches WHERE slot_id = $1`, [slotId]);

      action = "updated";
    } else {
      // 5) Insert new exam_slot
      const insertSlot = await client.query(
        `INSERT INTO exam_slot (startdate, enddate, physical_capacity)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [startDate, endDate, physicalCapacity]
      );
      slotId = insertSlot.rows[0].id as number;

      // Link the slot to course
      await client.query(
        `INSERT INTO course_slot (course_id, slot_id) VALUES ($1, $2)`,
        [courseId, slotId]
      );
      action = "created";
    }

    // 6) Generate batches for the (new or updated) slot
    const batches: { start: Date; end: Date; number: number }[] = [];
    let batchStart = new Date(startDate);
    let batchNumber = 1;

    // We'll use local getHours (server timezone). If you need Lagos timezone handling,
    // convert batchStart using the timezone library accordingly before the loop.
    while (batchStart < endDate) {
      // if batchStart is inside break window, move it to end of break
      if (
        batchStart.getHours() >= breakStartHour &&
        batchStart.getHours() < breakEndHour
      ) {
        batchStart.setHours(breakEndHour, 0, 0, 0);
      }

      const batchEnd = new Date(batchStart);
      batchEnd.setMinutes(batchEnd.getMinutes() + batchDurationMinutes);

      if (batchEnd > endDate) break;

      batches.push({
        start: new Date(batchStart),
        end: new Date(batchEnd),
        number: batchNumber,
      });

      // Next batch starts after batchGapMinutes from end
      const nextStart = new Date(batchEnd);
      nextStart.setMinutes(nextStart.getMinutes() + batchGapMinutes);
      batchStart = nextStart;
      batchNumber++;
    }

    // 7) Insert batches
    for (const b of batches) {
      await client.query(
        `INSERT INTO exam_batches (slot_id, batch_number, start_time, end_time, capacity)
         VALUES ($1, $2, $3, $4, $5)`,
        [slotId, b.number, b.start, b.end, physicalCapacity]
      );
    }

    await client.query("COMMIT");

    return { slotId, batchCount: batches.length, action };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};


export const createCourseService = async (
  code: string,
  title: string,
  level: number,
) => {
  const query = `
  INSERT INTO course (code, title, level)
  VALUES ($1, $2, $3)
  ON CONFLICT (code) DO NOTHING
  RETURNING *;
`;
  const values = [code, title, Number(level)];
  const { rows } = await connection.query(query, values);
  return rows[0];
};

/**
 * Admin reschedules a student's exam to a new slot and batch
 */
// Assignment of seat number was not handled here
export const adminRescheduleStudent = async (
  studentId: number,
  courseId: number,
  newBatchId: number
) => {
  // Step 1: Derive the slot from batch
  const batchRes = await connection.query(
    `SELECT slot_id FROM exam_batches WHERE id = $1`,
    [newBatchId]
  );

  if (batchRes.rowCount === 0) {
    throw new Error(`Batch ${newBatchId} does not exist`);
  }

  const newSlotId = batchRes.rows[0].slot_id;

  // Step 2: Check if the student already has a schedule for this course
  const existingScheduleRes = await connection.query(
    `SELECT id FROM student_schedule 
     WHERE student_id = $1 AND course_id = $2`,
    [studentId, courseId]
  );

  let result;
  if (existingScheduleRes.rowCount! > 0) {
    // Reschedule (update existing)
    const updateRes = await connection.query(
      `UPDATE student_schedule
       SET slot_id = $1, batch_id = $2, rescheduled = true
       WHERE student_id = $3 AND course_id = $4
       RETURNING *;`,
      [newSlotId, newBatchId, studentId, courseId]
    );

    result = { action: "rescheduled", schedule: updateRes.rows[0] };
  } else {
    // First-time schedule (insert)
    const insertRes = await connection.query(
      `INSERT INTO student_schedule (student_id, course_id, slot_id, batch_id, rescheduled)
       VALUES ($1, $2, $3, $4, false)
       RETURNING *;`,
      [studentId, courseId, newSlotId, newBatchId]
    );

    result = { action: "scheduled", schedule: insertRes.rows[0] };
  }

  return result;
};

