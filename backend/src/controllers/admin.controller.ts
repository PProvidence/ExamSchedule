import type { Request, Response } from "express";
import { createCourseService, createExamSlotWithBatches, adminRescheduleStudent } from "../services/admin.service";
import { fetchUserDetails } from "../services/user.service";

/**
 * Admin: Create a new course
 */
export const createCourse = async (req: Request, res: Response) => {
  const { code, title, level } = req.body;

  if (!code || !title) {
    return res.status(400).json({
      status: false,
      message: "Course code and title are required",
    });
  }

  try {
    const course = await createCourseService(code, title, level);
    res.status(201).json({
      status: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to create course",
    });
  }
};

/**
 * Admin: Create exam slot and auto-generate batches
 */
export const createExamSlot = async (req: Request, res: Response) => {
  const { courseId, startDate, endDate, physicalCapacity } = req.body;

  try {
    const slot = await createExamSlotWithBatches(
      Number(courseId),
      new Date(startDate),
      new Date(endDate),
      physicalCapacity
    );

    res.status(201).json({
      status: true,
      message: "Exam slot and batches created successfully",
      data: slot,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to create exam slot",
    });
  }
};

// Get user details
export const getUserDetails = async (req: Request, res: Response) => {
  const { studentId: id } = req.params;

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

/**
 * Admin: Reschedule a student's exam
 */
export const rescheduleStudent = async (req: Request, res: Response) => {
  const { studentId, courseId, newSlotId, newBatchId } = req.body;

  if (!studentId || !courseId || !newSlotId || !newBatchId) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

  try {
    const updated = await adminRescheduleStudent(
      parseInt(studentId),
      parseInt(courseId),
      // parseInt(newSlotId),
      parseInt(newBatchId)
    );

    res.status(200).json({
      status: true,
      message: "Student rescheduled successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to reschedule student",
    });
  }
};
