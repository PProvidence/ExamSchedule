import { Router } from "express";
import { createCourse, createExamSlot, getUserDetails, rescheduleStudent } from "../controllers/admin.controller";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware";
const adminRoutes = Router();

adminRoutes.post("/course", verifyToken, verifyRole("admin"), createCourse);
adminRoutes.post("/exam-slot", verifyToken, verifyRole("admin"), createExamSlot);
adminRoutes.get('/:studentId', verifyToken, verifyRole("admin"), getUserDetails); //Get student details including courses
adminRoutes.post("/reschedule-student", verifyToken, verifyRole("admin"), rescheduleStudent);

export {adminRoutes};
