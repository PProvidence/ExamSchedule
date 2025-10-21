import { Router } from "express";
import { createCourse, createExamSlot, getUserDetails, rescheduleStudent } from "../controllers/admin.controller";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware";
const adminRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrative operations for managing courses, exam slots, and student schedules
 */


/**
 * @swagger
 * /admin/course:
 *   post:
 *     tags: [Admin]
 *     summary: Create a new course
 *     description: Allows an admin to create a new course by providing the course code, title, and optional level.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - title
 *             properties:
 *               code:
 *                 type: string
 *                 example: "CSC301"
 *               title:
 *                 type: string
 *                 example: "Database Management Systems"
 *               level:
 *                 type: integer
 *                 example: 300
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Course created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     code:
 *                       type: string
 *                       example: "CSC301"
 *                     title:
 *                       type: string
 *                       example: "Database Management Systems"
 *                     level:
 *                       type: integer
 *                       example: 300
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Course code and title are required"
 *       500:
 *         description: Failed to create course
 */
adminRoutes.post("/course", verifyToken, verifyRole("admin"), createCourse);

/**
 * @swagger
 * /admin/exam-slot:
 *   post:
 *     tags: [Admin]
 *     summary: Create an exam slot and auto-generate batches
 *     description: Creates a new exam slot for a given course and generates its batches automatically.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - startDate
 *               - endDate
 *             properties:
 *               courseId:
 *                 type: integer
 *                 example: 101
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-20T09:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-11-20T12:00:00Z"
 *               physicalCapacity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Exam slot and batches created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Exam slot and batches created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     slotId:
 *                       type: integer
 *                       example: 5
 *                     courseId:
 *                       type: integer
 *                       example: 101
 *                     batches:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           batchId:
 *                             type: integer
 *                             example: 1
 *                           start_time:
 *                             type: string
 *                             example: "2025-11-20 09:00:00"
 *                           end_time:
 *                             type: string
 *                             example: "2025-11-20 10:00:00"
 *       500:
 *         description: Failed to create exam slot
 */
adminRoutes.post("/exam-slot", verifyToken, verifyRole("admin"), createExamSlot);

/**
 * @swagger
 * /admin/{studentId}:
 *   get:
 *     tags: [Admin]
 *     summary: Get student details by ID
 *     description: Retrieves full details of a student, including their registered courses and schedules.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *     responses:
 *       200:
 *         description: Student details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     email:
 *                       type: string
 *                       example: "jane@example.com"
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Computer Networks"
 *       400:
 *         description: Missing or invalid student ID
 *       500:
 *         description: Failed to retrieve user details
 */
adminRoutes.get('/:studentId', verifyToken, verifyRole("admin"), getUserDetails);

/**
 * @swagger
 * /admin/reschedule-student:
 *   post:
 *     tags: [Admin]
 *     summary: Reschedule a student's exam
 *     description: Allows an admin to reschedule a student to a new batch for a specific course.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - courseId
 *               - newSlotId
 *               - newBatchId
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 5
 *               courseId:
 *                 type: integer
 *                 example: 101
 *               newSlotId:
 *                 type: integer
 *                 example: 12
 *               newBatchId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Student rescheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Student rescheduled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: integer
 *                       example: 5
 *                     courseId:
 *                       type: integer
 *                       example: 101
 *                     batchId:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       500:
 *         description: Failed to reschedule student
 */
adminRoutes.post("/reschedule-student", verifyToken, verifyRole("admin"), rescheduleStudent);

export {adminRoutes};
