
import { JwtPayload } from "jsonwebtoken";
import { Student } from "../student.type";

declare global {
  namespace Express {
    interface Request {
      student?: string | JwtPayload | Student;
    }
  }
}