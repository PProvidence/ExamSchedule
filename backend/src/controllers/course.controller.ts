// import type { Request, Response } from "express";
// import {
//   findAllCourses,
//   findCourseByIdOrCode,
//   findCourseSlots,
//   createNewCourse,
//   updateCourseCapacity,
//   updateCourseSlots,
//   removeCourse,
// } from "../services/course.service.ts";
// import type { ICourse } from "../types/course.types.ts";
// import { ExamSlot } from "../models/examSlotSchema.ts";

// /**
//  * GET /schedule
//  * Fetch all courses
//  */
// export const getCourses = async (req: Request, res: Response) => {
//   try {
//     const courses = await findAllCourses();

//     if (!courses.length) {
//       return res.status(404).json({
//         status: false,
//         message: "No courses found",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Courses retrieved successfully",
//       data: courses,
//     });
//   } catch (error) {
//     console.error("getCourses error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An unexpected error occurred",
//       data: {},
//     });
//   }
// };

// /**
//  * GET /schedule/:course
//  * Fetch a single course by ID or course code
//  */
// export const getCourse = async (req: Request, res: Response) => {
//   const { course: courseParam } = req.params;

//   if (!courseParam) {
//     return res.status(400).json({
//       status: false,
//       message: "Course parameter is required",
//       data: {},
//     });
//   }

//   try {
//     const course = await findCourseByIdOrCode(courseParam);
//     if (!course) {
//       return res.status(404).json({
//         status: false,
//         message: "Course not found",
//         data: {},
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Course details retrieved successfully",
//       data: course,
//     });
//   } catch (error) {
//     console.error("getCourse error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An unexpected error occurred",
//       data: {},
//     });
//   }
// };

// /**
//  * GET /schedule/:course/students
//  * Get all students registered for a specific course (optionally by date & time)
//  */
// export const getRegisteredStudents = async (req: Request, res: Response) => {
//   const { course: courseParam } = req.params;
//   const { date, time } = req.query;

//   if (!courseParam) {
//     return res.status(400).json({
//       status: false,
//       message: "Course parameter is required",
//       data: {},
//     });
//   }

//   try {
//     const course = await findCourseByIdOrCode(courseParam);
//     if (!course) {
//       return res.status(404).json({
//         status: false,
//         message: "Course not found",
//         data: {},
//       });
//     }

//     let slots = await ExamSlot.find({ course: course._id }).populate({
//       path: "registeredStudents",
//       select: "fullName matricNo department level",
//     });

//     // Filter by date
//     if (date) {
//       const dateParam = new Date(date as string).toISOString().slice(0, 10);
//       slots = slots.filter((slot) => {
//         const slotDate = new Date(slot.date).toISOString().slice(0, 10);
//         return slotDate === dateParam;
//       });

//       // Filter by time if provided
//       if (time) {
//         const [hour, minute] = (time as string).split(":").map(Number);
//         slots = slots.filter((slot) => {
//           const slotDate = new Date(slot.startTime);
//           return (
//             slotDate.getUTCHours() === hour &&
//             slotDate.getUTCMinutes() === minute
//           );
//         });
//       }
//     }

//     const students = slots.flatMap((slot) => slot.registeredStudents);

//     return res.status(200).json({
//       status: true,
//       message: "Registered students retrieved successfully",
//       data: students,
//     });
//   } catch (error) {
//     console.error("getRegisteredStudents error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An unexpected error occurred",
//       data: {},
//     });
//   }
// };

// /**
//  * GET /schedule/:course/slots
//  * Get all available exam slots for a course
//  */
// export const getCourseSlots = async (req: Request, res: Response) => {
//   const { course: courseParam } = req.params;

//   if (!courseParam) {
//     return res.status(400).json({
//       status: false,
//       message: "Course parameter is required",
//       data: {},
//     });
//   }

//   try {
//     const slots = await findCourseSlots(courseParam);
//     if (!slots || !slots.length) {
//       return res.status(404).json({
//         status: false,
//         message: "No available slots found for this course",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       message: "Available slots retrieved successfully",
//       data: slots,
//     });
//   } catch (error) {
//     console.error("getCourseSlots error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An unexpected error occurred",
//       data: {},
//     });
//   }
// };

// /**
//  * POST /schedule
//  * Create a new course and its exam slots
//  */
// export const createCourse = async (req: Request, res: Response) => {
//   const courseDetails: ICourse = req.body;

//   if (!courseDetails.code) {
//     return res.status(400).json({
//       status: false,
//       message: "Course code is required",
//       data: {},
//     });
//   }

//   try {
//     const newCourse = await createNewCourse(courseDetails);
//     return res.status(201).json({
//       status: true,
//       message: "Course created successfully",
//       data: newCourse,
//     });
//   } catch (error: any) {
//     console.error("createCourse error:", error);
//     return res.status(500).json({
//       status: false,
//       message: error.message || "An unexpected error occurred",
//       data: {},
//     });
//   }
// };

// /**
//  * PUT /schedule/:course/capacity
//  * Edit course capacity
//  */
// export const editCapacity = async (req: Request, res: Response) => {
//   const { course } = req.params;
//   const { capacity } = req.body;

//   if (!course) {
//     return res.status(400).json({
//       status: false,
//       message: "Course parameter is required",
//       data: {},
//     });
//   }

//   try {
//     const updated = await updateCourseCapacity(course, capacity);
//     return res.status(200).json({
//       status: true,
//       message: "Capacity updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     console.error("editCapacity error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An unexpected error occurred",
//       data: {},
//     });
//   }
// };

// /**
//  * PUT /schedule/:course/slot
//  * Edit exam slots for a course (e.g. add/remove slots)
//  */
// export const editSlot = async (req: Request, res: Response) => {
//   const { course } = req.params;
//   const slotData = req.body;

//   if (!course) {
//     return res.status(400).json({
//       status: false,
//       message: "Course parameter is required",
//       data: {},
//     });
//   }

//   try {
//     const updatedSlots = await updateCourseSlots(course, slotData);
//     return res.status(200).json({
//       status: true,
//       message: "Slots updated successfully",
//       data: updatedSlots,
//     });
//   } catch (error) {
//     console.error("editSlot error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An unexpected error occurred",
//       data: {},
//     });
//   }
// };

// /**
//  * DELETE /schedule/:course
//  * Delete a course and all its exam slots
//  */
// export const deleteCourse = async (req: Request, res: Response) => {
//   const { course: courseParam } = req.params;

//   if (!courseParam) {
//     return res.status(400).json({
//       status: false,
//       message: "Course parameter is required",
//       data: {},
//     });
//   }

//   try {
//     const result = await removeCourse(courseParam);
//     return res.status(200).json({
//       status: true,
//       message: result,
//       data: {},
//     });
//   } catch (error) {
//     console.error("deleteCourse error:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An unexpected error occurred",
//       data: {},
//     });
//   }
// };
