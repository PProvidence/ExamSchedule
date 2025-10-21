import { Router } from "express";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware";
import {
  getUserExamSchedules,
  getAvailableSlotsForCourse,
  getUserDetails,
  pickExamBatch,
  getAvailableBatches,
} from "../controllers/student.controller";

const studentRoutes = Router();

// Courses & schedules
studentRoutes.get('/', verifyToken, getUserDetails); //Get student details including courses
studentRoutes.get('/:studentId/exam-schedules', verifyToken, getUserExamSchedules);
// Slot selection
studentRoutes.get('/slots/:courseId', verifyToken, getAvailableSlotsForCourse);
studentRoutes.get('/batches/:slotId', verifyToken, getAvailableBatches);
studentRoutes.post('/pick-batch', verifyToken, verifyRole('student'), pickExamBatch);
// studentRoutes.post('/reschedule-request', verifyToken, verifyRole('student'), pickExamBatch);



export { studentRoutes };
