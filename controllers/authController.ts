import { type Response, type Request, type NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import jwt from "jsonwebtoken";
import Student, { StudentType } from "../models/studentModel";
import sendResponse from "../utills/sendResponse";

interface DecodedJWT {
  id: string;
  iat: number;
}

function checkIfEnvExists(key: string): string {
  const env = process.env[key];
  if (!env) throw new Error(`Missing env var: ${key}`);
  return env;
}
const JWT_SECRET_KEY = checkIfEnvExists("JWT_SECRET_KEY");
const JWT_EXPIRES_IN_HOURS = Number(checkIfEnvExists("JWT_EXPIRES_IN")); // npr. 5 (sati)

function createJWT(student: HydratedDocument<StudentType>) {
  return jwt.sign({ id: student._id }, JWT_SECRET_KEY, {
    expiresIn: +JWT_EXPIRES_IN_HOURS * 60 * 60, // JWT_EXPIRES su satima, trenutno je stavljeno na 5 sati
  });
}

function setJWTInHttpOnlyCookie(jwtToken: string, res: Response) {
  const cookieOptions = {
    expires: new Date(Date.now() + +JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000), // sati su u pitanju
    sameSite: "none" as "none",
    secure: true,
    httpOnly: true,
  };
  res.cookie("jwt", jwtToken, cookieOptions);
}

// Treba da moze da se prosledi parametar allowedTo
// - Kako cu to da uradim?

export const allowedTo =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.student.isAdmin && allowedRoles.includes("admin")) {
      next();
    }
    return next(
      new AppError("You are not allowed to perform this action", 401)
    );
  };

export const protect = catchAsync(async (req, res, next) => {
  // Za protect middleware bitno je proveriti sledece edge case-ove
  // - Provera da li je korisnik ulogovan (Da li postoji JWT token)
  // - Validacija JWT tokena
  // - Provera da li je korisniku u medjuvremenu obrisan nalog
  // - Izmeni req objekat i dodaj student-a iz baze req.student = currentstudent i na kraju next()

  const jwtToken = req.cookies.jwt;

  if (!jwtToken) {
    return next(new AppError("You are not logged in!", 401));
  }

  // jwt.verify ce vratiti payload jwt-a
  const jwtPayload = jwt.verify(
    jwtToken,
    checkIfEnvExists("JWT_SECRET_KEY")
  ) as DecodedJWT;

  const student = await Student.findById(jwtPayload.id);
  if (!student) {
    return next(new AppError("Student does not exist", 404));
  }

  (req as any).Student = Student;
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
  const jwtToken = createJWT(student);
  setJWTInHttpOnlyCookie(jwtToken, res);
  sendResponse(res, 201, student);
});
