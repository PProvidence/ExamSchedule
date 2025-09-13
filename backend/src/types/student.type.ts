import type { Document } from "mongoose"

export interface Student extends Document{
    name: string,
    matric_number: string,
    password: string,
    level: Number,
    department: string
}

export type LoginSchema = Pick<Student, "matric_number" | "password">