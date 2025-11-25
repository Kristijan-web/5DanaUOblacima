import Canteen from "../models/CanteenModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import sendResponse from "../utills/sendResponse";

export const createCanteen = catchAsync(async (req, res, next) => {
  const canteen = await Canteen.create({
    name: req.body.name,
    location: req.body.location,
    capacity: req.body.capacity,
    workingHours: req.body.workingHours,
  });
  if (!canteen) {
    return next(new AppError("Failed to create canteen", 400));
  }
  sendResponse(res, 201, canteen);
});
