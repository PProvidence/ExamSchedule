import { Router } from "express";
import { createExamSlot } from "../controllers/schedule.controller.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";
const scheduleRouter = Router();

scheduleRouter.post("/slots", verifyToken, createExamSlot);

export default scheduleRouter;
