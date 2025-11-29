import Canteen from "../models/CanteenModel";
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
  const { studentId, canteenId, date, time, duration } = req.body;

  // Parse the date to midnight UTC for consistent comparison
  const reservationDate = new Date(date);

  const canteen = await Canteen.findById(canteenId);
  if (!canteen) {
    return next(new AppError("Canteen not found", 404));
  }
   
   // Helper function to convert time string to minutes
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const reservationStartMinutes = timeToMinutes(time);
  const reservationEndMinutes = reservationStartMinutes + duration;

  // Find the meal type that matches the reservation time
  const matchingMeal = canteen.workingHours.find((wh: any) => {
    const mealStartMinutes = timeToMinutes(wh.from);
    const mealEndMinutes = timeToMinutes(wh.to);
    
    // Check if both start and end time are within this meal's working hours
    return (
      reservationStartMinutes >= mealStartMinutes &&
      reservationEndMinutes <= mealEndMinutes
    );
  });

  if (!matchingMeal) {
    return next(
      new AppError(
        "Reservation time must be within canteen working hours for a meal type",
        400
      )
    );
  }

  const mealType = matchingMeal.meal;

  // Check if student already has a reservation at the same canteen, date, and time
  const existingReservation = await Reservation.findOne({
    studentId,
    canteenId,
    date: reservationDate,
    time,
  });


  if (existingReservation) {
    return next(
      new AppError(
        "You already have a reservation at this canteen for this time slot",
        400
      )
    );
  }

  const reservation = await Reservation.create({
    studentId,
    canteenId,
    date: reservationDate,
    time,
    duration,
  });

  if (!reservation)
    return next(new AppError("Failed to create reservation", 400));

  const reservationDTO = {
    id: reservation._id,
    studentId: reservation.studentId,
    canteenId: reservation.canteenId,
    date: reservation.date.toISOString().split("T")[0],
    time: reservation.time,
    duration: reservation.duration,
    status: reservation.status,
  }
  sendResponse(res, 201, reservationDTO as any);
});