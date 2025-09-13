import mongoose from "mongoose";
import type { Student } from "../types/student.type.ts";

const studentSchema = new mongoose.Schema<Student>({
    name: { type: String, required: true },
    matric_number: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: Number, required: true },
    department: { type: String, required: true }
});


export const StudentModel = mongoose.model('Student', studentSchema, 'Student');
