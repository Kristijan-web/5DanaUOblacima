import Reservation from "../models/reservationModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import sendResponse from "../utills/sendResponse";

export const createReservation = catchAsync(async (req, res, next) => {
  // Nije dozvoljeno kreirati rezervaciju za dane u prošlosti.
  // Znaci treba da uzmem canteenId

  // Mora da napravim timestamp od prosledjenog datuma i vremena i onda da proverim da li je timestmap manji od sadasnjeg vremena
  // "date": "2025-12-01",
  // "time": "07:30

  console.log("EVO ID-EVA", req.body.studentId, req.body.canteenId);

  const reservation = await Reservation.create({
    studentId: req.body.studentId,
    canteenId: req.body.canteenId,
    date: req.body.date,
    time: req.body.time,
    duration: req.body.duration,
  });
  if (!reservation)
    return next(new AppError("Failed to create reservation", 400));

  if (reservation.isReservationInPast(req.body.date, req.body.time))
    await reservation.deleteOne();
  sendResponse(res, 201, reservation);
});

// Pretvori _id u id
