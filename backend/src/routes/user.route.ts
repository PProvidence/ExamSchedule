import { Router } from "express";
const userRoutes = Router();

userRoutes.get('/me', ()=>{});
userRoutes.put('/:id',() => {});
userRoutes.get('/:id', ()=>{});

export {userRoutes}