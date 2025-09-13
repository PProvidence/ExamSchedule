import type { Request, Response} from "express";
import { StudentModel } from "../models/studentSchema.ts";
import type { LoginSchema, Student } from "../types/student.type.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

// Login function using jwt
export const login = async (req: Request, res: Response) : Promise<Response | void>  => {
    try {
      const {matric_number, password} : LoginSchema = req.body;
      
      const user = await StudentModel.findOne({matric_number});
      if(!user) {
        return res.status(401).json({
          status: false,
          message: "User does not exist"
        })
      }
    
     const isVerified = await bcrypt.compare(password, user.password);
      if(!isVerified) {
           return res.status(401).json({
          status: false,
          message: "Passwords do not match"
        })
      }
      const token = jwt.sign({id: user._id, matric_number: user.matric_number}, config.jwtSecret);

      //  const token = jwt.sign({id: user._id, matric_number: user.matric_number}, config.jwtSecret, { expiresIn: config.jwtLifetime || "1h" });
      return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        matric_number: user.matric_number,
        level: user.level,
        department: user.department,
      },
    });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(400).json({
        status: false,
        message: "An error occurred during login",
    });
}
}

// Logout function using jwt
// export const logout = async (req: Request, res: Response, next: NextFunction) => {
    
// 