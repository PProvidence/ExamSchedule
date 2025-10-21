import { config } from './config/config';
import express from 'express';
import type { Application } from "express";
import {swaggerDocs} from "./docs/swagger";
import { studentRoutes } from './routes/student.route';
import { adminRoutes } from './routes/admin.route';
import { authRoutes } from './routes/auth.route';
import { rescheduleRoutes } from './routes/reschedule.route';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);
app.use('/reschedule', rescheduleRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

swaggerDocs(app);

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});