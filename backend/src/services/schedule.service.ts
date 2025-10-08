import type { ResultSetHeader } from "mysql2";
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
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    // Insert exam slot
    const [slotResult] = await conn.query<ResultSetHeader>(
      `INSERT INTO exam_slot (startDate, endDate, physical_capacity) VALUES (?, ?, ?)`,
      [startDate, endDate, physicalCapacity]
    );
    const slotId = slotResult.insertId;

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

    // Insert batches into exam_batches table
    for (const batch of batches) {
      await conn.query<ResultSetHeader>(
        `INSERT INTO exam_batches (slot_id, batch_number, start_time, end_time, capacity) 
         VALUES (?, ?, ?, ?, ?)`,
        [slotId, batch.number, batch.start, batch.end, physicalCapacity]
      );
    }

    // Link slot to course
    await conn.query<ResultSetHeader>(
      `INSERT INTO course_slot (course_id, slot_id) VALUES (?, ?)`,
      [courseId, slotId]
    );

    await conn.commit();
    return { slotId, batchCount: batches.length };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
