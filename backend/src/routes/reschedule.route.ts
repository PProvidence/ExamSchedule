import { Router } from "express";
import { verifyRole, verifyToken } from "../middlewares/auth.middleware";
import {
    createRescheduleRequest,
    performReschedule,
    submitReschedulePayment,
    getAllRescheduleRequests,
    getRescheduleRequestById,
    handleRescheduleAction,
} from "../controllers/reschedule.controller";

const rescheduleRoutes = Router();

// Student creates a reschedule request
rescheduleRoutes.post(
    "/request",
    verifyToken,
    verifyRole("student"),
    createRescheduleRequest
);

// Student performs the actual rescheduling (after approval or payment)
rescheduleRoutes.post(
    "/",
    verifyToken,
    verifyRole("student"),
    performReschedule
);

// Student submits payment proof for rejected reschedule
rescheduleRoutes.post(
    "/payment",
    verifyToken,
    verifyRole("student"),
    submitReschedulePayment
);

// Admin views all reschedule requests
rescheduleRoutes.get(
    "/requests",
    verifyToken,
    verifyRole("admin"),
    getAllRescheduleRequests
);

// Admin views details of a single reschedule request
rescheduleRoutes.get(
    "/request/:id",
    verifyToken,
    verifyRole("admin"),
    getRescheduleRequestById
);

// Admin accepts or rejects a reschedule request
rescheduleRoutes.patch(
    "/request/action/:id",
    verifyToken,
    verifyRole("admin"),
    handleRescheduleAction
);

export { rescheduleRoutes };
