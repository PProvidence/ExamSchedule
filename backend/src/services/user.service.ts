import { connection } from "../config/config.ts"
import type { RowDataPacket, ResultSetHeader } from "mysql2";

// User authentication
export const authenticateUser = async (matricNo: string, password: string) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT id, matricNo, fullName, password 
     FROM student 
     WHERE matricNo = ?`,
    [matricNo]
  );

  if (rows.length === 0) throw new Error("Student not found");

  const user = rows[0];

  // For now: plain text comparison (replace with bcrypt later if needed)
  if (password !== user?.password) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...student } = user;
  return student;
};

// Get All Registered Students
export const getRegisteredStudents = async () => {
  const [rows] = await connection.query<RowDataPacket[]>(`
    SELECT id, matricNo, fullName, email, department, level, created_at 
    FROM student
    ORDER BY created_at DESC
  `);
  return rows;
};

// Get details of a particular user
export const fetchStudentDetails = async (studentId: number) => {
  // Fetch student basic info
  const [studentRows] = await connection.query<RowDataPacket[]>(
    `SELECT id, matricNo, fullName, email, department, level 
     FROM student 
     WHERE id = ?`,
    [studentId]
  );

  if (studentRows.length === 0) return null;
  const student = studentRows[0];

  // Fetch courses the student is enrolled in
  const [courses] = await connection.query<RowDataPacket[]>(
    `SELECT c.id, c.code, c.title
     FROM course c
     INNER JOIN student_course sc ON sc.course_id = c.id
     WHERE sc.student_id = ?`,
    [studentId]
  );

  // Fetch slots the student is registered for
  const [slots] = await connection.query<RowDataPacket[]>(
    `SELECT 
        es.id AS slotId,
        es.startDate,
        es.endDate,
        c.id AS courseId,
        c.code AS courseCode,
        c.title AS courseTitle,
        eb.id AS batchId,
        eb.start_time AS batchStartTime,
        eb.end_time AS batchEndTime
     FROM student_schedule ss
     INNER JOIN exam_slot es ON ss.slot_id = es.id
     INNER JOIN course c ON ss.course_id = c.id
     LEFT JOIN exam_batches eb ON ss.batch_id = eb.id
     WHERE ss.student_id = ?`,
    [studentId]
  );

  return { ...student, courses, slots };
};

// Get user exam schedules
export const fetchStudentExamSchedules = async (studentId: number) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT 
      scheduleId,
      courseCode,
      courseTitle,
      slotId,
      startDate,
      endDate,
      seatNumber,
      mode,
      scheduled_at,
      rescheduled
     FROM student_schedule 
     INNER JOIN course student_schedule.id = course.id
     INNER JOIN slot student_schedule.slot_id = slot.id
     INNER JOIN student student_schedule.student_id = student.id
     WHERE student_schedule.student_id = ?
     ORDER BY slot.startDate ASC`,
    [studentId]
  );

  return rows;
};

// Get available slots for a course based on caapcity and schedule
export const fetchAvailableSlotsForCourse = async (courseId: number) => {
  const [rows] = await connection.query<RowDataPacket[]>(`
    SELECT 
      exam_slot.id,
      exam_slot.startDate,
      exam_slot.endDate,
      exam_slot.physical_capacity,
      exam_slot.online_capacity,
      (exam_slot.physical_capacity - IFNULL(
        (SELECT COUNT(*) 
         FROM student_schedule 
         WHERE student_schedule.slot_id = exam_slot.id AND student_schedule.course_id = ?), 
        0
      )) AS availableSeats
    FROM exam_slot
    WHERE (exam_slot.physical_capacity - IFNULL(
        (SELECT COUNT(*) 
         FROM student_schedule 
         WHERE student_schedule.slot_id = exam_slot.id AND student_schedule.course_id = ?), 
        0
      )) > 0
    ORDER BY exam_slot.startDate ASC
  `, [courseId, courseId]);

  return rows;
};


export const fetchAvailableBatchesForSlot = async (slotId: number) => {
  const [rows] = await connection.query<RowDataPacket[]>(
    `SELECT 
       eb.id as batchId, eb.start_time, eb.end_time, eb.capacity,
       (eb.capacity - COUNT(ss.id)) as availableSeats
     FROM exam_batches eb
     LEFT JOIN student_schedule ss ON ss.batch_id = eb.id
     WHERE eb.slot_id = ?
     GROUP BY eb.id
     HAVING availableSeats > 0
     ORDER BY eb.start_time ASC`,
    [slotId]
  );

  return rows;
};

// Select exam batch
export const selectExamBatch = async (
  studentId: number,
  courseId: number,
  batchId: number,
  mode: "physical" | "online" = "physical"
) => {
  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    // Check if student already scheduled this course
    const [existing] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM student_schedule WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );
    if (existing.length > 0) throw new Error("Already scheduled for this course");

    // Get batch capacity and number of students scheduled
    const [batchRows] = await conn.query<RowDataPacket[]>(
      `SELECT id, slot_id, capacity FROM exam_batches WHERE id = ?`,
      [batchId]
    );
    if (!batchRows.length) throw new Error("Batch not found");

    const batch = batchRows[0];
    const [scheduledCountRows] = await conn.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM student_schedule WHERE batch_id = ?`,
      [batchId]
    );
    const totalScheduled = scheduledCountRows[0]?.total ?? 0;

    if (totalScheduled >= batch?.capacity) throw new Error("Batch is full");

    const seatNumber = totalScheduled + 1;

    // Insert student schedule
    await conn.query<ResultSetHeader>(
      `INSERT INTO student_schedule
       (student_id, course_id, slot_id, batch_id, seatNumber, mode, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [studentId, courseId, batch?.slot_id, batchId, seatNumber, mode]
    );

    await conn.commit();
    return { success: true, seatNumber, batchId, scheduledTime: batch?.start_time };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

/**
 * 4. Change exam slot for a student (reschedule)
 * - Marks current schedule as rescheduled = 1
 * - Updates the slot_id and seatNumber to the new one
 */
export const changeExamSlot = async (
  studentId: number,
  courseId: number,
  newSlotId: number,
  newSeatNumber: number
) => {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    // Update student's schedule for that course
    const [result] = await conn.query<ResultSetHeader>(
      `UPDATE student_schedule
       SET slot_id = ?, seatNumber = ?, rescheduled = 1
       WHERE student_id = ? AND course_id = ?`,
      [newSlotId, newSeatNumber, studentId, courseId]
    );

    if (result.affectedRows === 0) {
      throw new Error("No schedule found for this student and course");
    }

    await conn.commit();
    return { success: true };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};
