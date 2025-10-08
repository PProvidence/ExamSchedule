import type { Request, Response } from "express";
import { createExamSlotWithBatches } from "../services/schedule.service";


export const createExamSlot = async (req: Request, res: Response) => {
  const { courseId, startDate, endDate, physicalCapacity } = req.body;

  try {
    const result = await createExamSlotWithBatches(
      courseId,
      new Date(startDate),
      new Date(endDate),
      physicalCapacity
    );

    res.status(201).json({
      status: true,
      message: "Exam slot and batches created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to create exam slot with batches",
    });
  }
};
