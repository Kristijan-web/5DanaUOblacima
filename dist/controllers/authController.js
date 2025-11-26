"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.protect = exports.allowedTo = void 0;
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const studentModel_1 = __importDefault(require("../models/studentModel"));
const sendResponse_1 = __importDefault(require("../utills/sendResponse"));
// interface DecodedJWT {
//   id: string;
//   iat: number;
// }
// function checkIfEnvExists(key: string): string {
//   const env = process.env[key];
//   if (!env) throw new Error(`Missing env var: ${key}`);
//   return env;
// }
// const JWT_SECRET_KEY = checkIfEnvExists("JWT_SECRET_KEY");
// const JWT_EXPIRES_IN_HOURS = Number(checkIfEnvExists("JWT_EXPIRES_IN")); // npr. 5 (sati)
// function createJWT(student: HydratedDocument<StudentType>) {
//   return jwt.sign({ id: student._id }, JWT_SECRET_KEY, {
//     expiresIn: +JWT_EXPIRES_IN_HOURS * 60 * 60, // JWT_EXPIRES su satima, trenutno je stavljeno na 5 sati
//   });
// }
// function setJWTInHttpOnlyCookie(jwtToken: string, res: Response) {
//   const cookieOptions = {
//     expires: new Date(Date.now() + +JWT_EXPIRES_IN_HOURS * 60 * 60 * 1000), // sati su u pitanju
//     sameSite: "none" as "none",
//     secure: true,
//     httpOnly: true,
//   };
//   res.cookie("jwt", jwtToken, cookieOptions);
// }
// Treba da moze da se prosledi parametar allowedTo
// - Kako cu to da uradim?
const allowedTo = (...allowedRoles) => (req, res, next) => {
    console.log("EVO STUDENTA", req.student);
    console.log("EVO ALLOWED ROLES", allowedRoles);
    if (req.student.isAdmin && allowedRoles.includes("admin")) {
        return next();
    }
    return next(new appError_1.default("You are not allowed to perform this action", 401));
};
exports.allowedTo = allowedTo;
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    // dohvati id iz headera
    //   studentId
    const studentId = req.headers.studentId;
    console.log("Evo id-a student-a", req.get("studentId"));
    const student = await studentModel_1.default.findById(studentId);
    if (!student) {
        return next(new appError_1.default("Student does not exist", 404));
    }
    req.student = student;
    next();
});
// export const protect = catchAsync(async (req, res, next) => {
//   // Obrisi sve vezano za jwt
//   // koristi id koji dobijam u headeru za autorizaciju
//   const authHeader = req?.headers?.authorization;
//   const jwtToken = authHeader?.split(" ")[1];
//   console.log("evo tokena", jwtToken);
//   if (!jwtToken) {
//     return next(new AppError("You are not logged in!", 401));
//   }
//   // jwt.verify ce vratiti payload jwt-a
//   const jwtPayload = jwt.verify(
//     jwtToken,
//     checkIfEnvExists("JWT_SECRET_KEY")
//   ) as DecodedJWT;
//   const student = await Student.findById(jwtPayload.id);
//   if (!student) {
//     return next(new AppError("Student does not exist", 404));
//   }
//   (req as any).student = student;
//   next();
// });
exports.signup = (0, catchAsync_1.default)(async (req, res, next) => {
    const student = await studentModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
    });
    if (!student) {
        return next(new appError_1.default("Error, please contact the developer.", 404));
    }
    //   const jwtToken = createJWT(student);
    //   setJWTInHttpOnlyCookie(jwtToken, res);
    (0, sendResponse_1.default)(res, 201, student);
});
