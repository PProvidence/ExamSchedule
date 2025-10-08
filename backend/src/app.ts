import { config } from './config/config';
import express from 'express';
import type { Application } from "express";
import { userRoutes } from './routes/user.route';
import scheduleRouter from './routes/schedule.route';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', userRoutes);
app.use('/schedule', scheduleRouter);

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});