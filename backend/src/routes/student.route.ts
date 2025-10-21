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

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student-related endpoints
 */

/**
 * @swagger
 * /student/:
 *   get:
 *     tags: [Students]
 *     summary: Get authenticated student details
 *     description: Returns the details of the authenticated student including enrolled courses.
 *     security:
 *       - bearerAuth: []
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
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "student@example.com"
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                             example: 101
 *                           name:
 *                             type: string
 *                             example: "Computer Science"
 *       400:
 *         description: User ID missing or user not found
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
 *                   example: "User ID is unauthenticated"
 *                 data:
 *                   type: object
 *                   example: {}
 */
studentRoutes.get('/', verifyToken, getUserDetails);

/**
 * @swagger
 * /student/{studentId}/exam-schedules:
 *   get:
 *     tags: [Students]
 *     summary: Get exam schedules for a student
 *     description: Retrieves all exam schedules for a specific student by ID.
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
 *         description: Exam schedules retrieved successfully
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
 *                   example: "Exam schedules retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: number
 *                         example: 101
 *                       slotId:
 *                         type: number
 *                         example: 12
 *                       batchId:
 *                         type: number
 *                         example: 5
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-01"
 *       400:
 *         description: Student ID missing or schedules not found
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
 *                   example: "Student ID is required"
 *                 data:
 *                   type: object
 *                   example: {}
 */
studentRoutes.get('/exam-schedule', verifyToken, getUserExamSchedules);

/**
 * @swagger
 * /student/slots/{courseId}:
 *   get:
 *     tags: [Students]
 *     summary: Get available exam slots for a course
 *     description: Returns all available slots for a given course.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Available slots retrieved successfully
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
 *                   example: "Available slots retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       slotId:
 *                         type: number
 *                         example: 12
 *                       startdate:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-01"
 *                       enddate:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-01"
 *                       time:
 *                         type: string
 *                         example: "09:00 - 11:00"
 *       400:
 *         description: Course ID missing
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
 *                   example: "Course id is required"
 *                 data:
 *                   type: object
 *                   example: {}
 */
studentRoutes.get('/slots/:courseId', verifyToken, getAvailableSlotsForCourse);

/**
 * @swagger
 * /student/batches/{slotId}:
 *   get:
 *     tags: [Students]
 *     summary: Get available batches for a slot
 *     description: Retrieves available batches for a given slot, with Lagos timezone formatting.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the slot
 *     responses:
 *       200:
 *         description: Available batches retrieved successfully
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
 *                   example: "Available batches retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       batchId:
 *                         type: number
 *                         example: 5
 *                       start_time:
 *                         type: string
 *                         example: "2025-12-01 09:00:00"
 *                       end_time:
 *                         type: string
 *                         example: "2025-12-01 11:00:00"
*                       capacity:
 *                         type: number
 *                         example: 190 (Number of available seats)
 *       400:
 *         description: Slot ID missing
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
 *                   example: "slotId parameter is required"
 *                 data:
 *                   type: object
 *                   example: {}
 */
studentRoutes.get('/batches/:slotId', verifyToken, getAvailableBatches);

/**
 * @swagger
 * /student/pick-batch:
 *   post:
 *     tags: [Students]
 *     summary: Pick an exam batch
 *     description: Allows a student to select a batch for an exam.
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
 *               - batchId
 *             properties:
 *               courseId:
 *                 type: integer
 *                 example: 101
 *               batchId:
 *                 type: integer
 *                 example: 5
 *               mode:
 *                 type: string
 *                 enum: [physical, online]
 *                 example: "physical"
 *     responses:
 *       201:
 *         description: Batch selected successfully
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
 *                   example: "Batch selected successfully"
 *                 data:
 *                   type: object
 *                   properties:
*                     seatNumber:
 *                       type: number
 *                       example: 5
 *                     batchId:
 *                       type: number
 *                       example: 38
 *                     scheduledTime:
 *                       type: Date
 *                       example: "2025-12-01 11:00:00"
 *       400:
 *         description: Missing parameters or failure
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
 *                   example: "Student ID, Course ID and batchId are required"
 *                 data:
 *                   type: object
 *                   example: {}
 */
studentRoutes.post('/pick-batch', verifyToken, verifyRole('student'), pickExamBatch);


export { studentRoutes };
