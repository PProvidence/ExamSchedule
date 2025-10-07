import type { Request, Response } from "express";
import { authenticateUser, fetchAvailableSlotsForCourse, fetchStudentDetails, fetchStudentExamSchedules, selectExamSlot} from "../services/user.service.ts";

export const loginUser = async (req: Request, res: Response) => {
  const { matricNo, password } = req.body;

  if (!matricNo || !password) {
    return res.status(400).json({
      status: false,
      message: "Matric number and password are required",
      data: {},
    });
  }

  try {
    const token = await authenticateUser(matricNo, password);

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: { token },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Unable to login",
      data: {},
    });
  }
};

// Get registered courses for a student
export const getUserDetails = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({
      status: false,
      message: "Student ID is required",
      data: {},
    });
  }

  try {
    const student = await fetchStudentDetails(parseInt(studentId));
     if (!student) {
      return res.status(404).json({
        status: false,
        message: "Student not found",
        data: {},
      });
    }

      return res.status(200).json({
      status: true,
      message: "Student details retrieved successfully",
      data: student,
    });
  } catch (error: any) {
    console.error("Get Student Details Error:", error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to retrieve details",
      data: {},
    });
  }
};

// Get exam schedules for a student
export const getUserExamSchedules = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({
      status: false,
      message: "Student ID is required",
      data: {},
    });
  }

  try {
    const schedules = await fetchStudentExamSchedules(parseInt(studentId));
    return res.status(200).json({
      status: true,
      message: "Exam schedules retrieved successfully",
      data: schedules,
    });
  } catch (error: any) {
    console.error("GetUserExamSchedules Error:", error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to retrieve exam schedules",
      data: {},
    });
  }
};

// Get available slots for a course
export const getAvailableSlotsForCourse = async (req: Request, res: Response) => {
  const { studentId, courseId } = req.params;

  if (!studentId || !courseId) {
    return res.status(400).json({
      status: false,
      message: "Course id is required",
      data: {},
    });
  }

  try {
    const slots = await fetchAvailableSlotsForCourse(parseInt(courseId));
    return res.status(200).json({
      status: true,
      message: "Available slots retrieved successfully",
      data: slots,
    });
  } catch (error: any) {
    console.error("GetAvailableSlots Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to retrieve slots",
      data: {},
    });
  }
};

// Pick a slot for a course
export const pickExamSlot = async (req: Request, res: Response) => {
  const { studentId, courseId, slotId,  } = req.params;
  const { mode } = req.body;

  if (!studentId || !courseId || !slotId ) {
    return res.status(400).json({
      status: false,
      message: "Student ID, Course ID, slotId and scheduledTime are required",
      data: {},
    });
  }

  try {
    const schedule = await selectExamSlot(parseInt(studentId), parseInt(courseId), parseInt(slotId), mode);
    return res.status(201).json({
      status: true,
      message: "Slot picked successfully",
      data: schedule,
    });
  } catch (error: any) {
    console.error("PickExamSlot Error:", error);
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to pick slot",
      data: {},
    });
  }
};

// Student reschedule exam (self-service)
// export const rescheduleExam = async (req: Request, res: Response) => {
//   const { studentId, courseId, oldSlotId, newSlotId } = req.body;

//   if (!studentId || !courseId || !oldSlotId || !newSlotId) {
//     return res.status(400).json({
//       status: false,
//       message: "Student ID, course ID, old slot ID, and new slot ID are required",
//       data: {},
//     });
//   }

//   try {
//     const updatedSlot = await rescheduleExamService(studentId, courseId, oldSlotId, newSlotId);
//     return res.status(200).json({
//       status: true,
//       message: "Reschedule successful",
//       data: updatedSlot,
//     });
//   } catch (error: any) {
//     console.error("RescheduleExam Error:", error);
//     return res.status(400).json({
//       status: false,
//       message: error.message || "Failed to reschedule",
//       data: {},
//     });
//   }
// };

// Submit reschedule request
// export const submitRescheduleRequest = async (req: Request, res: Response) => {
//   const { studentId } = req.params;
//   const { courseId, oldSlotId, newSlotId, reason } = req.body;

//   if (!studentId || !courseId || !oldSlotId || !newSlotId || !reason) {
//     return res.status(400).json({
//       status: false,
//       message: "Student ID, schedule ID, and reason are required",
//       data: {},
//     });
//   }

//   try {
//     const request = await submitRequest(studentId, courseId, oldSlotId, newSlotId, reason);
//     return res.status(201).json({
//       status: true,
//       message: "Reschedule request submitted successfully",
//       data: request,
//     });
//   } catch (error: any) {
//     console.error("SubmitRescheduleRequest Error:", error);
//     return res.status(400).json({
//       status: false,
//       message: error.message || "Failed to submit reschedule request",
//       data: {},
//     });
//   }
// };

// Get student's reschedule requests
// export const getUserRescheduleRequests = async (req: Request, res: Response) => {
//   const { studentId } = req.params;

//   if (!studentId) {
//     return res.status(400).json({
//       status: false,
//       message: "Student ID is required",
//       data: {},
//     });
//   }

//   try {
//     const requests = await getRescheduleRequests(studentId);
//     return res.status(200).json({
//       status: true,
//       message: "Reschedule requests retrieved successfully",
//       data: requests,
//     });
//   } catch (error: any) {
//     console.error("GetUserRescheduleRequests Error:", error);
//     return res.status(400).json({
//       status: false,
//       message: error.message || "Failed to retrieve reschedule requests",
//       data: {},
//     });
//   }
// };

// Pay reschedule rejection fee
// export const payRescheduleRejectionFee = async (req: Request, res: Response) => {
//   const { studentId, requestId } = req.params;

//   if (!studentId || !requestId) {
//     return res.status(400).json({
//       status: false,
//       message: "Student ID and Request ID are required",
//       data: {},
//     });
//   }

//   try {
//     const result = await payRejectionFee(studentId, requestId);
//     return res.status(200).json({
//       status: true,
//       message: "Payment successful",
//       data: result,
//     });
//   } catch (error: any) {
//     console.error("PayRescheduleRejectionFee Error:", error);
//     return res.status(400).json({
//       status: false,
//       message: error.message || "Failed to process payment",
//       data: {},
//     });
//   }
// };
