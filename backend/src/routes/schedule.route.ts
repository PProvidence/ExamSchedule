import { Router } from "express";
import { createExamSlot } from "../controllers/schedule.controller";
import { verifyToken } from "../middlewares/auth.middleware";
const scheduleRouter = Router();

scheduleRouter.post("/slots", verifyToken, createExamSlot);

export default scheduleRouter;
