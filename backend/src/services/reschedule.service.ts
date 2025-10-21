import { connection } from "../config/config";


export const postRescheduleRequest = async (studentId: number, courseId: number, reason?: string) => {
  const existing = await connection.query(
    `SELECT * FROM reschedule_requests WHERE student_id = $1 AND course_id = $2 AND status IN ('pending', 'approved')`,
    [studentId, courseId]
  );
  if (existing.rowCount! > 0) throw new Error("A reschedule request already exists");

  const scheduleCheck = await connection.query(
    `SELECT created_at, rescheduled FROM student_schedule WHERE student_id = $1 AND course_id = $2`,
    [studentId, courseId]
  );

  if (scheduleCheck.rowCount === 0) throw new Error("Student not scheduled for this course");

  const { created_at, rescheduled } = scheduleCheck.rows[0];
  const hoursSinceSchedule = (Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60);

  if (rescheduled) throw new Error("Rescheduling can only be done once");

  const requireReason = hoursSinceSchedule > 6;
  if (requireReason && !reason) throw new Error("Reason required for rescheduling after 6 hours");

  const result = await connection.query(
    `INSERT INTO reschedule_requests (student_id, course_id, reason, status) VALUES ($1, $2, $3, 'pending') RETURNING *`,
    [studentId, courseId, reason]
  );

  return result.rows[0];
};


export const fetchAllRescheduleRequests = async () => {
  const result = await connection.query(
    `SELECT rr.*, s.fullname, c.course_code
     FROM reschedule_requests rr
     JOIN "user" s ON rr.student_id = s.id
     JOIN course c ON rr.course_id = c.id
     ORDER BY rr.created_at DESC`
  );
  return result.rows;
};

export const fetchRescheduleRequestById = async (id: number) => {
  const query = `
    SELECT rr.*, 
           u.fullname AS student_name, 
           u.email AS student_email,
           c.name AS course_name,
           es1.startdate AS old_slot_start,
           es2.startdate AS new_slot_start
    FROM reschedule_requests rr
    LEFT JOIN "user" u ON rr.student_id = u.id
    LEFT JOIN course c ON rr.course_id = c.id
    LEFT JOIN exam_slot es1 ON rr.old_slot_id = es1.id
    LEFT JOIN exam_slot es2 ON rr.new_slot_id = es2.id
    WHERE rr.id = $1
  `;
  const { rows } = await connection.query(query, [id]);
  return rows[0] || null;
};


export const updateRescheduleStatus = async (id: number, status: 'approved' | 'rejected', adminReason?: string) => {
  const result = await connection.query(
    `UPDATE reschedule_requests SET status = $1, admin_reason = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
    [status, adminReason || null, id]
  );
  return result.rows[0];
};

export const rescheduleAction = async (studentId: number, courseId: number, newSlotId: number, newBatchId: number) => {
  const approvedReq = await connection.query(
    `SELECT * FROM reschedule_requests WHERE student_id = $1 AND course_id = $2 AND status = 'approved'`,
    [studentId, courseId]
  );
  if (approvedReq.rowCount === 0) throw new Error("No approved reschedule request found");

  const update = await connection.query(
    `UPDATE student_schedule SET slot_id = $1, batch_id = $2, rescheduled = true WHERE student_id = $3 AND course_id = $4 RETURNING *`,
    [newSlotId, newBatchId, studentId, courseId]
  );

  await connection.query(
    `UPDATE reschedule_requests SET status = 'completed', updated_at = NOW() WHERE id = $1`,
    [approvedReq.rows[0].id]
  );

  return update.rows[0];
};

export const recordReschedulePayment = async (requestId: number, paymentRef: string) => {
  const query = `
    UPDATE reschedule_requests
    SET status = 'paid',
        payment_ref = $2
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await connection.query(query, [requestId, paymentRef]);
  return rows[0] || null;
};
