import Canteen from "../models/CanteenModel";
import Reservation from "../models/reservationModel";
import Restriction, { RestrictionType } from "../models/Restriction";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";

export const createRestriction = catchAsync(async (req, res, next) => {
  const { id: canteenId } = req.params;

  const restriction = await Restriction.create(req.body);
  if (!restriction) {
    return next(new AppError("Failed to create restriction", 400));
  }
  // const restrtictionStartDate = restriction?.startDate;
  // const restrictionEndDate = restriction?.endDate;

  const reservatiosn = await Reservation.find({ canteen: canteenId });

  // kada treba izvrsiti loguiku
  // - Nakon pravljenje restriction

  //   const canteen = await Canteen.findById(canteenId);

  // Pravljenje restriction logike
  // - Napravi se nova restrikcija to mora

  // Sta se desava nakon sto se napravi nova restrikcija
  // Ulazi se u reservations i prolazi kroz sve rezervacije i brisu se one koje su u konfliktu sa restriction
});
