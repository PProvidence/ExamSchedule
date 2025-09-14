import type { Request, Response } from "express"
import "../models/courseSchema.ts"
import type { JwtPayload } from "jsonwebtoken";
import { StudentModel } from "../models/studentSchema.ts";

export const getUser = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {id} = req.params;
        const role = (req as JwtPayload).user || {};
        let studentQuery = StudentModel.findById(id)
    
    if (role === "admin") {
      studentQuery = studentQuery.select("-password").populate({
        path: "bookings.course",
        select: "code title",
      }).populate("bookings.course", "code title slots")
    } else {
        studentQuery = studentQuery
        .select("name matric_number department level bookings")
        .populate({
          path: "bookings.course",
          select: "code title slots",
        });
    }

    const student = await studentQuery.lean();

  if (!student) {return res.status(400).json({
    status: false,
    message: "User does not exist on database",
  })}

   if (student.bookings) {
      student.bookings = student.bookings.map((booking) => {
        const course = booking.course as any;
        const chosenSlot = course?.slots?.find(
          (slot: any) => slot._id.toString() === booking.slotId.toString()
        );

        return {
          ...booking,
          chosenSlot,
        };
      });
    }

    
  return res.status(200).json({
    status: true,
    message: "User details retreived successfully",
    data: student
  })

  
    } catch (error) {
      console.error("Error", error)
    return res.status(400).json({
    status: false,
    message: "An unexpected error occurred",
    })
}}

// Already implemented by umis
// export const updateUser = async (req: Request, res: Response): Promise<Response | void> => {
//     try {
        
//     } catch (error) {
        
//     }
// }