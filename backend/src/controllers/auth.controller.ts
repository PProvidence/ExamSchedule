
import jwt, { type SignOptions } from "jsonwebtoken";
import { authenticateUser } from "../services/user.service";
import { config } from "../config/config";
import type { Request, Response } from "express";

export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier|| !password) {
    return res.status(400).json({
      status: false,
       message: "Email/Matric number and password are required",
      data: {},
    });
  }

  try {
    const user = await authenticateUser(identifier, password);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid credentials",
        data: {},
      });
    }

    const token = jwt.sign(
      {...user},
      config.jwtSecret,
      { expiresIn: config.jwtLifetime } as SignOptions
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: { token, user},
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Unable to login",
      data: {},
    });
  }
};
