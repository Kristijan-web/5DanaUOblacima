import Reservation from "../models/reservationModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import sendResponse from "../utills/sendResponse";

export const createReservation = catchAsync(async (req, res, next) => {
  const canteen = await Reservation.create({
    studentId: req.body.studentId,
    canteenId: req.body.canteenId,
    date: req.body.date,
    time: req.body.time,
    duration: req.body.duration,
  });
  if (!canteen) return next(new AppError("Failed to create canteen", 400));

  sendResponse(res, 201, canteen);
});
