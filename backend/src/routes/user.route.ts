import { Router } from "express";
import {  verifyToken } from "../middlewares/auth.middleware.ts";
import { getUser } from "../controllers/user.controller.ts";
const userRoutes = Router();

userRoutes.get('/:id', verifyToken, getUser);
// userRoutes.get('/:id', verifyToken, verifyRole, ()=>{});
// userRoutes.put('/:id', verifyToken, () => {}); Already implemented by UMIS

export {userRoutes}