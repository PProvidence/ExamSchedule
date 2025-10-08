import { connection } from "../config/config.ts";

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

    // Insert exam slot and return its ID
    const slotResult = await client.query(
      `INSERT INTO exam_slot (start_date, end_date, physical_capacity)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [startDate, endDate, physicalCapacity]
    );
    const slotId = slotResult.rows[0].id;

    // Generate batches
    const batches: { start: Date; end: Date; number: number }[] = [];
    let batchStart = new Date(startDate);
    let batchNumber = 1;

    while (batchStart < endDate) {
      // Skip break time if batchStart falls into the break window
      if (
        batchStart.getHours() >= breakStartHour &&
        batchStart.getHours() < breakEndHour
      ) {
        batchStart.setHours(breakEndHour, 0, 0, 0);
      }

      const batchEnd = new Date(batchStart);
      batchEnd.setMinutes(batchEnd.getMinutes() + batchDurationMinutes);

      // Stop if the batch end exceeds the exam slot end time
      if (batchEnd > endDate) break;

      batches.push({
        start: new Date(batchStart),
        end: new Date(batchEnd),
        number: batchNumber,
      });

      // Move start time for next batch: end time + gap
      const nextStart = new Date(batchEnd);
      nextStart.setMinutes(nextStart.getMinutes() + batchGapMinutes);
      batchStart = nextStart;
      batchNumber++;
    }

    // Insert batches
    for (const batch of batches) {
      await client.query(
        `INSERT INTO exam_batches (slot_id, batch_number, start_time, end_time, capacity)
         VALUES ($1, $2, $3, $4, $5)`,
        [slotId, batch.number, batch.start, batch.end, physicalCapacity]
      );
    }

    // Link slot to course
    await client.query(
      `INSERT INTO course_slot (course_id, slot_id) VALUES ($1, $2)`,
      [courseId, slotId]
    );

    await client.query("COMMIT");
    return { slotId, batchCount: batches.length };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
