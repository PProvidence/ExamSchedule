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

  const student = rows[0];
  if (password !== student?.password) {
    throw new Error("Invalid credentials");
  }

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
  const [studentRows] = await connection.query<RowDataPacket[]>(
    `SELECT id, matricNo, fullName, email, department, level 
     FROM student 
     WHERE id = ?`,
    [studentId]
  );

  if (studentRows.length === 0) return null;
  const student = studentRows[0];

  const [courses] = await connection.query<RowDataPacket[]>(
    `SELECT c.id, c.code, c.title
     FROM course c
     INNER JOIN student_course sc ON sc.course_id = c.id
     WHERE sc.student_id = ?`,
    [studentId]
  );

  return { ...student, courses };
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
  const [rows] = await connection.query<RowDataPacket[]>(
    `
    SELECT 
     id,
     startDate,
     endDate,
     physical_capacity,
     online_capacity,
      (physical_capacity - COUNT(student_schedule.id)) AS availablePhysicalSeats
    FROM slot sl
    LEFT JOIN student_schedule ON student_schedule.slot_id =id AND student_schedule.course_id = ?
    GROUP BY id
    HAVING avaia=lablePhysicalSeats > 0
    ORDER BY startDate ASC
    `,
    [courseId]
  );

  return rows;
};

// Helper to calculate next available batch time and seat number
const calculateBatchAndSeat = async (slotId: number) => {

  const [slotRows] = await connection.query<RowDataPacket[]>(
    `SELECT id, startDate, endDate, physical_capacity 
     FROM exam_slot WHERE id = ?`,
    [slotId]
  );

  if (slotRows.length === 0) throw new Error("Exam slot not found");
  const slot = slotRows[0];

  const slotStart = new Date(slot?.startDate);
  const slotEnd = new Date(slot?.endDate);
  const breakStart = new Date(slotStart);
  breakStart.setHours(13, 0, 0, 0);
  const breakEnd = new Date(slotStart);
  breakEnd.setHours(14, 0, 0, 0); 

  // Get number of students alreay scheduled for the exam
  const [scheduledRows] = await connection.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM student_schedule WHERE slot_id = ?`,
    [slotId]
  );

  const totalScheduled = scheduledRows[0]?.total as number;
  const batchSize = slot?.physical_capacity;

  //Calculate seat number
  const batchNumber = Math.floor(totalScheduled / batchSize);
  const seatNumber = (totalScheduled % batchSize) + 1;

  // 4. Calculate batch start time
  const batchDurationMinutes = 60;
  const breakDurationMinutes = 60;
  const batchStartTime = new Date(slotStart);

  // Add time for previous batches
  let addedMinutes = batchNumber * batchDurationMinutes + batchNumber * 30; // 30 min intervals between batches

  batchStartTime.setMinutes(batchStartTime.getMinutes() + addedMinutes);

  // Check if this batch crosses break time — push it forward if needed
  if (batchStartTime >= breakStart && batchStartTime < breakEnd) {
    const diff = breakEnd.getTime() - slotStart.getTime();
    batchStartTime.setTime(batchStartTime.getTime() + diff);
  }

  if (batchStartTime >= slotEnd) {
    throw new Error("No more batches available for this slot");
  }

  return { batchStartTime, seatNumber };
};

// Pick a slot and insert it into student_schedule if not already scheduled
export const selectExamSlot = async (
  studentId: number,
  courseId: number,
  slotId: number,
  mode: "physical" | "online" = "physical"
) => {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    // Ensure not already scheduled for this course
    const [existing] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM student_schedule 
       WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );

    if (existing.length > 0) {
      throw new Error("You have already selected a slot for this course");
    }

    // Calculate seat number and batch time
    const { seatNumber, batchStartTime } = await calculateBatchAndSeat(slotId);

    // Insert schedule record
    await conn.query<ResultSetHeader>(
      `INSERT INTO student_schedule 
        (student_id, course_id, slot_id, seatNumber, mode, scheduled_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [studentId, courseId, slotId, seatNumber, mode, batchStartTime]
    );

    await conn.commit();
    return { success: true, seatNumber, scheduledTime: batchStartTime };
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
