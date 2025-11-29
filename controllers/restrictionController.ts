import { HydratedDocument } from "mongoose";
import Canteen from "../models/CanteenModel";
import Reservation from "../models/reservationModel";
import Restriction, { RestrictionType } from "../models/restrictionModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import { sendCancellationNotification } from "../utills/snsMail";

export const createRestriction = catchAsync(async (req, res, next) => {
  const { id: canteenId } = req.params;

  const restriction = await Restriction.create(req.body as RestrictionType);
  if (!restriction) {
    return next(new AppError("Failed to create restriction", 400));
  }

  sendCancellationNotification({
    studentEmail: "krimster8@gmail.com",
    canteenName: "testt",
    reservationTime: "20",
  });

  const restrictionStartDate = restriction.startDate;
  const restrictionEndDate = restriction.endDate;
  const reservations = await Reservation.find({ canteen: canteenId });

  // Treba proci kroz sve rezervacije i vratiti one koje ne ispunjavaju uslov restrikcije
  const invalidReservatiosn = reservations.map((reservation) => {});
});

//
