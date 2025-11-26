import Reservation from "../models/reservationModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import sendResponse from "../utills/sendResponse";

export const getReservations = catchAsync(async (req, res, next) => {
  const reservations = await Reservation.find();

  sendResponse(res, 200, reservations);
});

export const getReservation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const reservation = await Reservation.findById(id);

  if (!reservation) {
    return next(new AppError("Reservation not found", 404));
  }

  sendResponse(res, 200, reservation);
});

export const createReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.create({
    studentId: req.body.studentId,
    canteenId: req.body.canteenId,
    date: req.body.date,
    time: req.body.time,
    duration: req.body.duration,
  });
  if (!reservation)
    return next(new AppError("Failed to create reservation", 400));

  if (reservation.isReservationInPast(req.body.date, req.body.time)) {
    await reservation.deleteOne();
    return next(new AppError("Can't make reservation in the past", 400));
  }
  sendResponse(res, 201, reservation);
});

// Pretvori _id u id
