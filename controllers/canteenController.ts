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

export const updateCanteen = catchAsync(async (req, res, next) => {
  const id = req.params;

  // findByIdAndUpdate ne trigeruje mongoose document middleware
  const updatedCanteen = await Canteen.findByIdAndUpdate(id, req.body.data, {
    new: true,
    runValidators: true,
  });

  if (!updatedCanteen) {
    return next(new AppError("Something went wrong updating canteen", 400));
  }

  sendResponse(res, 201, updatedCanteen);
});
