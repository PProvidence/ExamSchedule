
import { JwtPayload } from "jsonwebtoken";
import { Student } from "../src/types/student.type";

declare global {
  namespace Express {
    interface Request {
      student?: string | JwtPayload | Student;
    }
  }
}

export {}