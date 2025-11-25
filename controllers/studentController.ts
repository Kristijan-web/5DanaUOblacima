import catchAsync from "../utills/catchAsync";

export const createStudent = catchAsync(async (req, res, next) => {
  console.log("Upao u create student controller");
});
