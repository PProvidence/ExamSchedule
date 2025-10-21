import { connection } from "../config/config";

// User authentication
export const authenticateUser = async (identifier: string, password: string) => {
  const result = await connection.query(
    `SELECT *
     FROM "user"
      WHERE matricno = $1 OR email = $1`,
    [identifier]
  );

  if (result.rows.length === 0) throw new Error("User not found");
  
  const response = result.rows[0];

  // Plain text comparison for now (replace with bcrypt later)
  if (password !== response.password) throw new Error("Invalid credentials");

  const { password: _, ...user } = response;
  return user;
};

// Get All Registered Students
export const getRegisteredStudents = async () => {
  const result = await connection.query(
    `SELECT id, matricno, fullname, email, department, level, created_at 
     FROM user
     ORDER BY created_at DESC`
  );
  return result.rows;
};

// Get details of a particular user
export const fetchUserDetails = async (id: number) => {
  // User info
  const userResult = await connection.query(
    `SELECT id, matricno, fullname, email, department, level 
     FROM "user" 
     WHERE id = $1`,
    [id]
  );

  if (userResult.rows.length === 0) return null;
  const user = userResult.rows[0];

  // Courses
  const coursesResult = await connection.query(
    `SELECT c.id, c.code, c.title
     FROM course c
     INNER JOIN student_course sc ON sc.course_id = c.id
     WHERE sc.student_id = $1`,
    [id]
  );

  // Slots
  const slotsResult = await connection.query(
    `SELECT 
        es.id AS slotid,
        es.startdate,
        es.enddate,
        c.id AS courseid,
        c.code AS coursecode,
        c.title AS coursetitle,
        eb.id AS batchid,
        eb.start_time AS batchstarttime,
        eb.end_time AS batchendtime
     FROM student_schedule ss
     INNER JOIN exam_slot es ON ss.slot_id = es.id
     INNER JOIN course c ON ss.course_id = c.id
     LEFT JOIN exam_batches eb ON ss.batch_id = eb.id
     WHERE ss.student_id = $1`,
    [id]
  );

  return { ...user, courses: coursesResult.rows, slots: slotsResult.rows };
};

// Get user exam schedules
export const fetchStudentExamSchedules = async (studentId: number) => {
  const result = await connection.query(
    `SELECT 
        ss.id as scheduleid,
        c.code as coursecode,
        c.title as coursetitle,
        es.id as slotid,
        es.startdate,
        es.enddate,
        ss.seatnumber,
        ss.mode,
        ss.created_at,
        ss.rescheduled
     FROM student_schedule ss
     INNER JOIN course c ON ss.course_id = c.id
     INNER JOIN exam_slot es ON ss.slot_id = es.id
     INNER JOIN student s ON ss.student_id = s.id
     WHERE ss.student_id = $1
     ORDER BY es.startdate ASC`,
    [studentId]
  );

  return result.rows;
};

// Get available slots for a course
export const fetchAvailableSlotsForCourse = async (courseId: number) => {
  const result = await connection.query(
    `
    SELECT 
      es.id,
      es.startdate,
      es.enddate,
      es.physical_capacity,
      es.online_capacity,
      (es.physical_capacity - COALESCE(
        (SELECT COUNT(*) 
         FROM student_schedule ss
         WHERE ss.slot_id = es.id AND ss.course_id = $1), 
        0
      )) AS availableseats
    FROM course_slot cs
    JOIN exam_slot es ON cs.slot_id = es.id
    WHERE cs.course_id = $1
      AND (es.physical_capacity - COALESCE(
        (SELECT COUNT(*) 
         FROM student_schedule ss
         WHERE ss.slot_id = es.id AND ss.course_id = $1), 
        0
      )) > 0
    ORDER BY es.startdate ASC
    `,
    [courseId]
  );

  return result.rows;
};


// Get available batches for a slot
export const fetchAvailableBatchesForSlot = async (slotId: number) => {
  const result = await connection.query(
    `SELECT 
       eb.id as batchid, 
       eb.start_time, 
       eb.end_time, 
       eb.capacity,
       (eb.capacity - COUNT(ss.id)) as availableseats
     FROM exam_batches eb
     LEFT JOIN student_schedule ss ON ss.batch_id = eb.id
     WHERE eb.slot_id = $1
     GROUP BY eb.id
     HAVING (eb.capacity - COUNT(ss.id)) > 0
     ORDER BY eb.start_time ASC`,
    [slotId]
  );

  return result.rows;
};

// Select exam batch
export const selectExamBatch = async (
  studentId: number,
  courseId: number,
  batchId: number,
  mode: "physical" | "online" = "physical"
) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");

    // Check existing schedule
    const existing = await client.query(
      `SELECT id FROM student_schedule WHERE student_id = $1 AND course_id = $2`,
      [studentId, courseId]
    );
    if (existing.rows.length > 0) throw new Error("Already scheduled for this course");

    // Batch capacity
    const batchRes = await client.query(
      `SELECT id, slot_id, capacity FROM exam_batches WHERE id = $1`,
      [batchId]
    );
    if (batchRes.rows.length === 0) throw new Error("Batch not found");

    const batch = batchRes.rows[0];

    const scheduledCountRes = await client.query(
      `SELECT COUNT(*) as total FROM student_schedule WHERE batch_id = $1`,
      [batchId]
    );
    const totalScheduled = Number(scheduledCountRes.rows[0].total) || 0;

    if (totalScheduled >= batch.capacity) throw new Error("Batch is full");

    const seatNumber = totalScheduled + 1;

    // Insert schedule
    await client.query(
      `INSERT INTO student_schedule
       (student_id, course_id, slot_id, batch_id, seatnumber, mode, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [studentId, courseId, batch.slot_id, batchId, seatNumber, mode]
    );

    await client.query("COMMIT");
    return { success: true, seatNumber, batchId, scheduledTime: batch.start_time };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Change exam slot (reschedule)
export const changeExamSlot = async (
  studentId: number,
  courseId: number,
  newSlotId: number,
  newSeatNumber: number
) => {
  const client = await connection.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(
      `UPDATE student_schedule
       SET slot_id = $1, seatnumber = $2, rescheduled = 1
       WHERE student_id = $3 AND course_id = $4`,
      [newSlotId, newSeatNumber, studentId, courseId]
    );

    if (result.rowCount === 0) {
      throw new Error("No schedule found for this student and course");
    }

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
