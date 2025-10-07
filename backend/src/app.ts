import { config } from './config/config.ts';
import express from 'express';
import type { Application } from "express";
import { userRoutes } from './routes/user.route.ts';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRoutes);
app.use('/user', userRoutes);
// app.use('/course', examSchedulingRoutes);

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});