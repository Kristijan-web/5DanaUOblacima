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
    if (!student.isAdmin) {
        return next(new appError_1.default("You are not allowed to perform this action", 401));
    }
    req.student = student;
    next();
});
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
