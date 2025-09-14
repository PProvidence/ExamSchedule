import mongoose, { Schema, Document } from "mongoose";

interface ICourse extends Document {
  code: string;
  title: string;
  level: string;
  slots: {
    date: Date;
    capacity: {
      physical: number;
      online: number;
    };
    registeredStudents: {
      student: mongoose.Types.ObjectId;
      mode: "physical" | "online";
    }[];
  }[];
}

const CourseSchema = new Schema<ICourse>({
  code: { type: String, required: true },
  title: { type: String, required: true },
  level: { type: String, required: true },
  slots: [
    {
      date: { type: Date, required: true },
      capacity: {
        physical: { type: Number, default: 100 },
        online: { type: Number, default: 100 },
      },
      registeredStudents: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
          mode: { type: String, enum: ["physical", "online"], required: true },
        },
      ],
    },
  ],
});

export default mongoose.model<ICourse>("Course", CourseSchema, "Course");
