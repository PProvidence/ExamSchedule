import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.ts";
import {
  loginUser,
  getUserExamSchedules,
  getAvailableSlotsForCourse,
  pickExamSlot,
  getUserDetails,
} from "../controllers/user.controller.ts";
import { validateSchema } from "../middlewares/validation.middleware.ts";
import { loginSchema } from "../validations/user.validations.ts";


const userRoutes = Router();

// Auth
userRoutes.post('/auth/login', validateSchema(loginSchema), loginUser);

// Courses & schedules
userRoutes.get('/:studentId', verifyToken, getUserDetails); //Get student details including courses
userRoutes.get('/:studentId/exam-schedules', verifyToken, getUserExamSchedules);

// Slot selection
userRoutes.get('/:studentId/available-slots/:courseId', verifyToken, getAvailableSlotsForCourse);
userRoutes.post('/:studentId/pick-slot/:courseId', verifyToken, pickExamSlot);

// Rescheduling (student-initiated)
// userRoutes.patch('/:studentId/exam-schedules/:scheduleId/reschedule', verifyToken, rescheduleExam);
// userRoutes.post('/:studentId/reschedule-requests', verifyToken, submitRescheduleRequest);
// userRoutes.get('/:studentId/reschedule-requests', verifyToken, getUserRescheduleRequests);
// userRoutes.patch('/:studentId/pay-rejection-fee/:requestId', verifyToken, payRescheduleRejectionFee);

export { userRoutes };
