import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { config } from "../config/config.ts";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", " ");

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "Unverified user",
                data: {}
            })
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, config.jwtSecret);
                (req as JwtPayload).user = decoded;
            } catch (error) {
                return res.status(401).json({
                    status: false,
                    message: "invalid token",
                    data: {},
                });
            }
        }

        next();

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Unverified user/ Unexpected error",
            data: {}
        })
    }
}