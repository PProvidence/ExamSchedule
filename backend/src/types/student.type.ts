import type { Document, Types } from "mongoose";

export enum Role {
  Admin = "Admin",
  Student = "Student"
}

export enum Status { Scheduled = "scheduled", Rescheduled = "rescheduled", Missed = "missed" }

export enum Mode {
  Physical = "physical",
  Online = "online"
}

export interface CourseSelection {
  course: Types.ObjectId;         // reference to Course collection
  chosenSlotId: Types.ObjectId;   // reference to the chosen slot inside that course
  mode: Mode;
  status: Status,
  rescheduleCount: number
}

export interface Student extends Document {
  name: string;
  matric_number: string;
  password: string;
  level: number;
  department: string;
  role?: Role;
  bookings?: CourseSelection[];
}

export type LoginSchema = Pick<Student, "matric_number" | "password">;
