import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"
import { config } from "../config/config.ts";

export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

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

export const verifyRole = (roleInput: string) => async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

    const role = (req as JwtPayload).user;

    // verify if user role is equal to inputed role
    if (role !== roleInput)
        return res.status(400).json({ status: false, message: "unauthorized access", data: {} });
    next();

}