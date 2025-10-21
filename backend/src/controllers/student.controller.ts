import type { Request, Response } from "express";
import { JwtPayload} from "jsonwebtoken";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { fetchAvailableBatchesForSlot, fetchAvailableSlotsForCourse, fetchUserDetails, fetchStudentExamSchedules, selectExamBatch } from "../services/user.service";

dayjs.extend(utc);
dayjs.extend(timezone);

// Get details of authenticated user
export const getUserDetails = async (req: Request, res: Response) => {
  const { id } = (req as JwtPayload).user;

  if (!id) {
    return res.status(400).json({
      status: false,
      message: "User ID is required",
      data: {},
    });
  }

  try {
    const user = await fetchUserDetails(parseInt(id));
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
        data: {},
      });
    }

    return res.status(200).json({
      status: true,
      message: "User details retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    console.error("Get User Details Error:", error);
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
  const { courseId } = req.params;

  if (!courseId) {
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

export const getAvailableBatches = async (req: Request, res: Response) => {
  const { slotId } = req.params;

  if (!slotId) {
    return res.status(400).json({
      status: false,
      message: "slotId parameter is required",
      data: {},
    });
  }

  try {
    const batches = await fetchAvailableBatchesForSlot(parseInt(slotId, 10));
    const formatted = batches.map((b: any) => ({
      ...b,
      start_time: dayjs.utc(b.start_time).tz("Africa/Lagos").format("YYYY-MM-DD HH:mm:ss"),
      end_time: dayjs.utc(b.end_time).tz("Africa/Lagos").format("YYYY-MM-DD HH:mm:ss"),
    }));
    return res.status(200).json({
      status: true,
      message: "Available batches retrieved successfully",
      data: formatted,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch batches",
      data: {},
    });
  }
};


// Pick Exam Batch Controller
export const pickExamBatch = async (req: Request, res: Response) => {
  const { id } = (req as JwtPayload).user;
  const { courseId, batchId, mode = "physical" } = req.body;

  if (!id || !courseId || !batchId) {
    return res.status(400).json({
      status: false,
      message: "Student ID, Course ID and batchId are required",
      data: {},
    });
  }

  try {
    const schedule = await selectExamBatch(
      parseInt(id),
      parseInt(courseId),
      parseInt(batchId),
      mode
    );
    return res.status(201).json({
      status: true,
      message: "Batch selected successfully",
      data: schedule,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message || "Failed to pick batch",
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
