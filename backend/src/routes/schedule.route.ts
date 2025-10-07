// import { Router } from "express";
// import { verifyToken } from "../middlewares/auth.middleware.ts";
// import {
//   getAllExams,
//   getExamById,
//   getExamAvailableSlots,
//   allocateSeatsForExam,
//   allocateSeatForStudent,
//   adminRescheduleStudentExam,
// } from "../controllers/examScheduling.controller.ts";

// const examSchedulingRoutes = Router();

// // Exams
// examSchedulingRoutes.get('/', verifyToken, getAllExams); //for admin
// examSchedulingRoutes.get('/:examId', verifyToken, getExamById);
// examSchedulingRoutes.get('/:examId/available-slots', verifyToken, getExamAvailableSlots);

// // Seat allocation
// examSchedulingRoutes.post('/:examId/allocate-seats', verifyToken, allocateSeatsForExam);
// examSchedulingRoutes.post('/:examId/student/:studentId/allocate', verifyToken, allocateSeatForStudent);

// // Admin reschedule for student
// examSchedulingRoutes.patch('/:examId/reschedule/:studentId', verifyToken, adminRescheduleStudentExam);

// export { examSchedulingRoutes };
