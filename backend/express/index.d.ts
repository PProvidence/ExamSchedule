
import { JwtPayload } from "jsonwebtoken";
import { User } from "../src/types/user.type";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload | User;
    }
  }
}

export {}