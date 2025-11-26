"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.getStudents = exports.getStudent = void 0;
const studentModel_1 = __importDefault(require("../models/studentModel"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const sendResponse_1 = __importDefault(require("../utills/sendResponse"));
exports.getStudent = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    console.log("evo id studnet-a", id);
    const student = await studentModel_1.default.findById(id);
    if (!student) {
        return next(new appError_1.default("Student does not exist", 404));
    }
    (0, sendResponse_1.default)(res, 200, student);
});
exports.getStudents = (0, catchAsync_1.default)(async (req, res, next) => {
    const students = await studentModel_1.default.find();
    (0, sendResponse_1.default)(res, 200, students);
});
exports.updateStudent = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const updatedStudent = await studentModel_1.default.findByIdAndUpdate(id, req.body, {
        runValidators: true,
        new: true,
    });
    if (!updatedStudent) {
        return next(new appError_1.default("Student not found", 404));
    }
    (0, sendResponse_1.default)(res, 200, updatedStudent);
});
exports.deleteStudent = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const deletedStudent = await studentModel_1.default.findByIdAndDelete(id);
    if (!deletedStudent) {
        return next(new appError_1.default("Specified user does not exist", 404));
    }
    (0, sendResponse_1.default)(res, 204, deletedStudent);
});
