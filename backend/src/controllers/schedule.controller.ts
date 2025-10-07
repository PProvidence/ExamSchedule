// import type { Request, Response } from "express";

// /**
//  * GET /exams
//  * Get all exams
//  */
// export const getAllExams = async (req: Request, res: Response) => {
//   try {
//     const exams = await Exam.find().populate("course slots");
//     return res.status(200).json({
//       status: true,
//       message: "All exams retrieved successfully",
//       data: exams,
//     });
//   } catch (error) {
//     console.error("getAllExams error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to retrieve exams",
//       data: [],
//     });
//   }
// };

// /**
//  * GET /exams/:examId
//  * Get a single exam by ID
//  */
// export const getExamById = async (req: Request, res: Response) => {
//   const { examId } = req.params;

//   if (!Types.ObjectId.isValid(examId)) {
//     return res.status(400).json({
//       status: false,
//       message: "Invalid exam ID",
//       data: {},
//     });
//   }

//   try {
//     const exam = await Exam.findById(examId).populate("course slots");
//     if (!exam) {
//       return res.status(404).json({
//         status: false,
//         message: "Exam not found",
//         data: {},
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Exam retrieved successfully",
//       data: exam,
//     });
//   } catch (error) {
//     console.error("getExamById error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to retrieve exam",
//       data: {},
//     });
//   }
// };

// /**
//  * GET /exams/:examId/slots
//  * Get available slots for a specific exam
//  */
// export const getExamAvailableSlots = async (req: Request, res: Response) => {
//   const { examId } = req.params;

//   if (!Types.ObjectId.isValid(examId)) {
//     return res.status(400).json({
//       status: false,
//       message: "Invalid exam ID",
//       data: [],
//     });
//   }

//   try {
//     const slots = await ExamSlot.find({ exam: examId }).populate("course");
//     return res.status(200).json({
//       status: true,
//       message: "Available slots retrieved successfully",
//       data: slots,
//     });
//   } catch (error) {
//     console.error("getExamAvailableSlots error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to retrieve available slots",
//       data: [],
//     });
//   }
// };

// /**
//  * POST /exams/:examId/allocate
//  * Allocate all registered students to exam slots automatically
//  */
// export const allocateSeatsForExam = async (req: Request, res: Response) => {
//   const { examId } = req.params;

//   if (!Types.ObjectId.isValid(examId)) {
//     return res.status(400).json({
//       status: false,
//       message: "Invalid exam ID",
//       data: {},
//     });
//   }

//   try {
//     const exam = await Exam.findById(examId).populate("course slots");
//     if (!exam) {
//       return res.status(404).json({
//         status: false,
//         message: "Exam not found",
//         data: {},
//       });
//     }

//     const slots = await ExamSlot.find({ exam: exam._id });
//     const students = await Student.find({ courses: exam.course });

//     if (!slots.length) {
//       return res.status(400).json({
//         status: false,
//         message: "No available slots to allocate",
//         data: {},
//       });
//     }

//     let currentSlotIndex = 0;
//     for (const student of students) {
//       const slot = slots[currentSlotIndex];

//       slot.registeredStudents.push({
//         student: student._id,
//         mode: "physical", // or decide mode dynamically
//       });
//       await slot.save();

//       currentSlotIndex = (currentSlotIndex + 1) % slots.length;
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Seats allocated successfully",
//       data: {},
//     });
//   } catch (error) {
//     console.error("allocateSeatsForExam error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to allocate seats",
//       data: {},
//     });
//   }
// };

// /**
//  * POST /exams/:examId/allocate/:studentId
//  * Allocate a single student to an exam slot manually
//  */
// export const allocateSeatForStudent = async (req: Request, res: Response) => {
//   const { examId, studentId } = req.params;
//   const { slotId, mode } = req.body;

//   if (!Types.ObjectId.isValid(examId) || !Types.ObjectId.isValid(studentId)) {
//     return res.status(400).json({
//       status: false,
//       message: "Invalid ID(s)",
//       data: {},
//     });
//   }

//   try {
//     const slot = await ExamSlot.findById(slotId);
//     if (!slot) {
//       return res.status(404).json({
//         status: false,
//         message: "Slot not found",
//         data: {},
//       });
//     }

//     // Check capacity
//     const physicalCount = slot.registeredStudents.filter(
//       (s) => s.mode === "physical"
//     ).length;
//     const onlineCount = slot.registeredStudents.filter(
//       (s) => s.mode === "online"
//     ).length;

//     if (
//       (mode === "physical" && physicalCount >= slot.capacity.physical) ||
//       (mode === "online" && onlineCount >= slot.capacity.online)
//     ) {
//       return res.status(400).json({
//         status: false,
//         message: "Slot is full for the selected mode",
//         data: {},
//       });
//     }

//     slot.registeredStudents.push({ student: new Types.ObjectId(studentId), mode });
//     await slot.save();

//     return res.status(200).json({
//       status: true,
//       message: "Student allocated successfully",
//       data: slot,
//     });
//   } catch (error) {
//     console.error("allocateSeatForStudent error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to allocate student",
//       data: {},
//     });
//   }
// };

// /**
//  * PUT /exams/:examId/reschedule/:studentId
//  * Admin reschedules a student's exam to another slot
//  */
// export const adminRescheduleStudentExam = async (req: Request, res: Response) => {
//   const { examId, studentId } = req.params;
//   const { newSlotId } = req.body;

//   if (
//     !Types.ObjectId.isValid(examId) ||
//     !Types.ObjectId.isValid(studentId) ||
//     !Types.ObjectId.isValid(newSlotId)
//   ) {
//     return res.status(400).json({
//       status: false,
//       message: "Invalid ID(s)",
//       data: {},
//     });
//   }

//   try {
//     // Remove student from old slot
//     await ExamSlot.updateMany(
//       { exam: examId },
//       { $pull: { registeredStudents: { student: new Types.ObjectId(studentId) } } }
//     );

//     // Add to new slot
//     await ExamSlot.findByIdAndUpdate(newSlotId, {
//       $push: {
//         registeredStudents: { student: new Types.ObjectId(studentId), mode: "physical" },
//       },
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Student rescheduled successfully",
//       data: {},
//     });
//   } catch (error) {
//     console.error("adminRescheduleStudentExam error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Failed to reschedule student",
//       data: {},
//     });
//   }
// };
