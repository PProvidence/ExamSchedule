import { Types } from "mongoose";
import { Course } from "../models/courseSchema.ts";
import { ExamSlot } from "../models/examSlotSchema.ts";
import type { ICourse } from "../types/course.types.ts";

/**
 * Fetch all courses with their slots
 */
export const findAllCourses = async (): Promise<ICourse[]> => {
  const courses : ICourse[] = await Course.find().populate("slots").lean<ICourse[]>();
  return courses;
};


/**
 * Find a course by ID or course code
 */
export const findCourseByIdOrCode = async (
  courseParam: string
): Promise<ICourse | null> => {
  if (Types.ObjectId.isValid(courseParam)) {
    return Course.findById(courseParam).populate("slots").lean<ICourse>().exec();;
  }
  return Course.findOne({ code: courseParam.toUpperCase() }).populate("slots").lean<ICourse>().exec();;
};

/**
 * Find all slots for a given course
 */
export const findCourseSlots = async (courseParam: string) => {
  const course = await findCourseByIdOrCode(courseParam);
  if (!course) throw new Error("Course not found");

  const slots = await ExamSlot.find({ course: course._id });
  return slots.map(slot => ({
    slotId: slot._id,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    capacity: slot.capacity,
    registered: slot.registeredStudents.length,
    remaining: slot.capacity - slot.registeredStudents.length,
  }));
};

/**
 * Create a new course and optionally its exam slots
 */
export const createNewCourse = async (courseDetails: ICourse) => {
  // Check for existing course code
  const existing = await Course.findOne({ code: courseDetails.code });
  if (existing) throw new Error("Course code already exists");

  // Create course
  const course = await Course.create(courseDetails);

  // If slot data was passed with the course
  if (Array.isArray(courseDetails.slots) && courseDetails.slots.length > 0) {
    const slotDocs = await ExamSlot.insertMany(
      courseDetails.slots.map(slot => ({
        ...slot,
        course: course._id,
      }))
    );

    // Link slots to course
    course.slots = slotDocs.map(s => s._id as Types.ObjectId);
    await course.save();
  }

  return Course.findById(course._id).populate("slots");
};

/**
 * Update a course's capacity
 */
export const updateCourseCapacity = async (
  courseParam: string,
  newCapacity: number
) => {
  const course = await findCourseByIdOrCode(courseParam);
  if (!course) throw new Error("Course not found");

  course.capacity = newCapacity;
  await course.save();
  return course;
};

/**
 * Update a course's exam slots (add, edit, or remove)
 */
export const updateCourseSlots = async (
  courseParam: string,
  slotData: any[] // You can replace this with a proper type later
) => {
  const course = await findCourseByIdOrCode(courseParam);
  if (!course) throw new Error("Course not found");

  // Remove existing slots for this course
  await ExamSlot.deleteMany({ course: course._id });

  // Insert new slot set
  const newSlots = await ExamSlot.insertMany(
    slotData.map(slot => ({
      ...slot,
      course: course._id,
    }))
  );

  // Update course's slots reference
  course.slots = newSlots.map(s => s._id);
  await course.save();

  return newSlots;
};

/**
 * Remove a course and all its associated exam slots
 */
export const removeCourse = async (courseParam: string) => {
  const course = await findCourseByIdOrCode(courseParam);
  if (!course) throw new Error("Course not found");

  await ExamSlot.deleteMany({ course: course._id });
  await Course.findByIdAndDelete(course._id);

  return "Course and associated slots deleted successfully";
};
