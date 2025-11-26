import Canteen from "../models/CanteenModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import sendResponse from "../utills/sendResponse";

export const getCanteens = catchAsync(async (req, res, next) => {
  const canteens = await Canteen.find();

  sendResponse(res, 200, canteens);
});

export const getCanteen = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const canteen = await Canteen.findById(id);

  if (!canteen) {
    return next(new AppError("Canteen not found", 404));
  }

  sendResponse(res, 200, canteen);
});

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
  const { id } = req.params;

  // findByIdAndUpdate ne trigeruje mongoose document middleware
  const updatedCanteen = await Canteen.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCanteen) {
    return next(new AppError("Something went wrong updating canteen", 400));
  }

  sendResponse(res, 200, updatedCanteen);
});

export const deleteCanteen = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedCanteen = await Canteen.findByIdAndDelete(id);

  if (!deletedCanteen) {
    return next(new AppError("Specified canteen not found!", 404));
  }

  sendResponse(res, 204, deletedCanteen);
});

export const getCanteensByStatus = catchAsync(async (req, res, next) => {
  const { startDate, startTime, endDate, endTime, duration } = req.query;
});
