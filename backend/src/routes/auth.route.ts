import { Router } from "express";
import { login } from "../controllers/auth.controller.ts";
const authRoutes = Router();

authRoutes.post('/login', login);
// authRoutes.get('/logout',() => {});

export {authRoutes}