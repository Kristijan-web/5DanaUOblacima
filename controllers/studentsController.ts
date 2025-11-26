import Student from "../models/studentModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import sendResponse from "../utills/sendResponse";

export const getStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log("evo id studnet-a", id);
  const student = await Student.findById(id);

  if (!student) {
    return next(new AppError("Student does not exist", 404));
  }

  sendResponse(res, 200, student);
});

export const getStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find();

  sendResponse(res, 200, students);
});

export const updateStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!updatedStudent) {
    return next(new AppError("Student not found", 404));
  }

  sendResponse(res, 200, updatedStudent);
});

export const deleteStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedStudent = await Student.findByIdAndDelete(id);

  if (!deletedStudent) {
    return next(new AppError("Specified user does not exist", 404));
  }
  sendResponse(res, 204, deletedStudent);
});
