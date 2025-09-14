import mongoose from "mongoose";

interface IStudent extends Document {
    name: string;
    matric_number: string;
    password: string;
    level: number;
    department: string;
    role: string;
    bookings: {
        course: mongoose.Types.ObjectId;
        slotId: mongoose.Types.ObjectId;
        mode: "physical" | "online";
        status: "scheduled" | "missed" | "taken"
    }[];
}

const studentSchema = new mongoose.Schema<IStudent>({
    name: { type: String, required: true },
    matric_number: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: Number, required: true },
    department: { type: String, required: true },
    role: { type: String, default: "Student" },
    bookings: [
        {
            course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
            slotId: { type: mongoose.Schema.Types.ObjectId, required: true},
            mode: { type: String, enum: ["physical", "online"], required: true },
            status: { type: String, enum: ["scheduled", "missed", "taken"], required: true },
        },
    ],
});


export const StudentModel = mongoose.model('Student', studentSchema, 'Student');
