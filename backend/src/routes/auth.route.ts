
import { Router } from "express";
import { loginUser } from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validation.middleware";
import { loginSchema } from "../validations/user.validations";

const authRoutes = Router();

// Auth
authRoutes.post('/login', validateSchema(loginSchema), loginUser);

export {authRoutes};