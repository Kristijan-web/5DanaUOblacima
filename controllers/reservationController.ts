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
  // ovde da pozovem find
  // Sta zelim?
  // - Da proverim da li postoji vec rezervacija u iste vreme u istoj menzi
  // - Ne sme da se napravi novi zapis ako vec postoji

  // Sta je problem?
  // Ne znam gde da pisem logiku za tu proveru, dal u document middleware-u, dal u query middleware-u ili ovde u controller-u?

  // Zasto ne document middleware?
  // - On sadrzi podatke spremne za slanje bazi mogu tu da uzmem id da uradim find

  const reservation = await Reservation.create({
    studentId: req.body.studentId,
    canteenId: req.body.canteenId,
    date: req.body.date,
    time: req.body.time,
    duration: req.body.duration,
  });

  if (!reservation)
    return next(new AppError("Failed to create reservation", 400));

  sendResponse(res, 201, reservation);
});
