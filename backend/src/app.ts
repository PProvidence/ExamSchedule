import { config } from './config/config.ts';
import express from 'express';
import type { Application } from "express";
import { authRoutes } from './routes/auth.route.ts';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});