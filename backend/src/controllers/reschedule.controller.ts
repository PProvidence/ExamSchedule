import type { Response, Request } from "express";
import { fetchAllRescheduleRequests, fetchRescheduleRequestById, postRescheduleRequest, recordReschedulePayment, rescheduleAction, updateRescheduleStatus } from "../services/reschedule.service";
import { JwtPayload } from "jsonwebtoken";

export const createRescheduleRequest = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, reason } = req.body;

    const result = await postRescheduleRequest(studentId, courseId, reason);

    return res.status(201).json({
      status: true,
      message: "Reschedule request submitted successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message || "Failed to submit reschedule request",
    });
  }
};

export const getAllRescheduleRequests = async (req: Request, res: Response) => {
  try {
    const requests = await fetchAllRescheduleRequests();
    res.status(200).json({
      status: true,
      message: "Fetched all reschedule requests",
      data: requests,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getRescheduleRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const request = await fetchRescheduleRequestById(+id);

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "Reschedule request not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Reschedule request fetched successfully",
      data: request,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to fetch reschedule request",
    });
  }
};
export const performReschedule = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, newSlotId, newBatchId } = req.body;
    const updated = await rescheduleAction(studentId, courseId, newSlotId, newBatchId);
    res.status(200).json({
      status: true,
      message: "Reschedule completed successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const handleRescheduleAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, adminReason } = req.body; // action = 'accept' | 'reject'

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({
        status: false,
        message: "Invalid action. Must be 'accept' or 'reject'",
      });
    }

    const newStatus = action === "accept" ? "approved" : "rejected";
    const updatedRequest = await updateRescheduleStatus(
      +id,
      newStatus,
      adminReason
    );

    res.status(200).json({
      status: true,
      message:
        newStatus === "approved"
          ? "Reschedule request approved"
          : "Reschedule request rejected",
      data: updatedRequest,
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "Failed to process reschedule action",
    });
  }
};

export const submitReschedulePayment = async (req: Request, res: Response) => {
  try {
    const { requestId, paymentRef } = req.body;
    const user = (req as JwtPayload).user;

    if (!requestId || !paymentRef) {
      return res.status(400).json({
        status: false,
        message: "requestId and paymentRef are required",
      });
    }

    // Verify ownership of the request
    const request = await fetchRescheduleRequestById(requestId);

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "Reschedule request not found",
      });
    }

    if (request.student_id !== user.id) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized: You can only pay for your own reschedule request",
      });
    }

    // Ensure the request was rejected before allowing payment
    if (request.status !== "rejected") {
      return res.status(400).json({
        status: false,
        message: "Payment can only be submitted for rejected requests",
      });
    }

    // Record payment and mark request as 'paid'
    const updatedRequest = await recordReschedulePayment(
      requestId,
      paymentRef
    );

    if (!updatedRequest) {
      return res.status(500).json({
        status: false,
        message: "Failed to record payment",
      });
    }

    return res.status(200).json({
      status: true,
      message:
        "Payment recorded successfully. You can now reschedule your exam.",
      data: updatedRequest,
    });
  } catch (error: any) {
    console.error("Payment submission error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "An unexpected error occurred",
    });
  }
};
