import e, { type Response, type Request, type NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import Student, { StudentType } from "../models/studentModel";
import sendResponse from "../utills/sendResponse";

export const allowedTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("EVO STUDENTA", req.student);
    console.log("EVO ALLOWED ROLES", allowedRoles);
    if (req.student.isAdmin && allowedRoles.includes("admin")) {
      return next();
    }
    return next(
      new AppError("You are not allowed to perform this action", 401)
    );
  };

export const protect = catchAsync(async (req, res, next) => {
  // dohvati id iz headera
  //   studentId
  const studentId = req.headers.studentId;
  console.log("Evo id-a student-a", req.get("studentId"));

  const student = await Student.findById(studentId);
  if (!student) {
    return next(new AppError("Student does not exist", 404));
  }

  if (!student.isAdmin) {
    return next(
      new AppError("You are not allowed to perform this action", 401)
    );
  }

  (req as any).student = student;
  next();
});

export const signup = catchAsync(async (req, res, next) => {
  const student = await Student.create({
    name: req.body.name,
    email: req.body.email,
    isAdmin: req.body.isAdmin,
  });
  if (!student) {
    return next(new AppError("Error, please contact the developer.", 404));
  }
  //   const jwtToken = createJWT(student);
  //   setJWTInHttpOnlyCookie(jwtToken, res);
  sendResponse(res, 201, student);
});
