import type { NextFunction, Request, Response } from "express";
import type { Schema } from "joi";

export const validateSchema = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(422).json({
      status: false,
      data: [],
      message: error.details[0]?.message,
    });
  }

  next();
};