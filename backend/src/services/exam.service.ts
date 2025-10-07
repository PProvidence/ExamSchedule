import { Course } from "../models/courseSchema.ts";
import { ExamSlot } from "../models/examSlotSchema.ts";
import { Student } from "../models/studentSchema.ts";
import { RescheduleRequest } from "../models/rescheduleRequestSchema.ts";
import { Types } from "mongoose";

/**
 * Get available exam slots for a course
 */
export const getAvailableSlots = async (courseId: string, studentId: string) => {
  const course = await Course.findById(courseId).populate("slots");
  if (!course) throw new Error("Course not found");

  const slots = await ExamSlot.find({ course: course._id });

  // Calculate remaining capacity for each slot
  const availableSlots = slots.map(slot => {
    const remaining = slot.capacity - slot.registeredStudents.length;
    return {
      slotId: slot._id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacityRemaining: remaining,
    };
  });

  return availableSlots;
};

/**
 * Student picks a slot for a course
 */
export const pickExamSlot = async (
  studentId: string,
  courseId: string,
  slotId: string
) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const slot = await ExamSlot.findById(slotId);
  if (!slot || slot.course.toString() !== courseId)
    throw new Error("Invalid slot for this course");

  // Check capacity
  if (slot.registeredStudents.length >= slot.capacity)
    throw new Error("Slot is full");

  // Add student to slot
  if (!slot.registeredStudents.includes(new Types.ObjectId(student._id))) {
    slot.registeredStudents.push(student._id);
    await slot.save();
  }

  // Track that this student has chosen a slot for this course
  if (!course.registeredStudents.includes(new Types.ObjectId(student._id))) {
    course.registeredStudents.push(student._id);
    await course.save();
  }

  return slot;
};

/**
 * Student reschedules their exam to a new slot
 */
export const rescheduleExam = async (
  studentId: string,
  courseId: string,
  oldSlotId: string,
  newSlotId: string
) => {
  const student = await Student.findById(studentId);
  if (!student) throw new Error("Student not found");

  const oldSlot = await ExamSlot.findById(oldSlotId);
  const newSlot = await ExamSlot.findById(newSlotId);

  if (!oldSlot || !newSlot) throw new Error("Invalid slot(s)");
  if (oldSlot.course.toString() !== courseId || newSlot.course.toString() !== courseId)
    throw new Error("Slots do not match the course");

  // Check if new slot has capacity
  if (newSlot.registeredStudents.length >= newSlot.capacity)
    throw new Error("New slot is full");

  // Remove from old slot
  oldSlot.registeredStudents = oldSlot.registeredStudents.filter(
    s => s.toString() !== student._id.toString()
  );
  await oldSlot.save();

  // Add to new slot
  if (!newSlot.registeredStudents.includes(student._id)) {
    newSlot.registeredStudents.push(student._id);
    await newSlot.save();
  }

  return newSlot;
};

/**
 * Submit a reschedule request (for admin approval)
 */
export const submitRescheduleRequest = async (
  studentId: string,
  courseId: string,
  oldSlotId: string,
  newSlotId: string,
  reason: string
) => {
  const existing = await RescheduleRequest.findOne({
    student: studentId,
    course: courseId,
    oldSlot: oldSlotId,
  });

  if (existing) throw new Error("You have already submitted a reschedule request");

  const request = await RescheduleRequest.create({
    student: studentId,
    course: courseId,
    oldSlot: oldSlotId,
    newSlot: newSlotId,
    reason,
    status: "pending",
  });

  return request;
};
