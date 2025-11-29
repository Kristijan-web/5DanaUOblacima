import Canteen from "../models/CanteenModel";
import Reservation from "../models/reservationModel";
import AppError from "../utills/appError";
import catchAsync from "../utills/catchAsync";
import generateTimeSlots from "../utills/generateTimeSlots";
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
  const { startDate, endDate, startTime, endTime, duration } = req.query;

  // Validate required parameters
  if (!startDate || !endDate || !startTime || !endTime || !duration) {
    return next(
      new AppError(
        "Missing required query parameters: startDate, endDate, startTime, endTime, duration",
        400
      )
    );
  }

  const durationInt = Number(duration);

  // Validate duration is 30 or 60
  if (durationInt !== 30 && durationInt !== 60) {
    return next(new AppError("Duration must be 30 or 60 minutes", 400));
  }

  // Get all canteens
  const canteens = await Canteen.find();

  // Process each canteen
  const result = await Promise.all(
    canteens.map(async (canteen) => {
      // Generate time slots based on query parameters and canteen's working hours
      const timeSlots = generateTimeSlots(
        startDate as string,
        endDate as string,
        startTime as string,
        endTime as string,
        durationInt,
        canteen.workingHours
      );

      // For each slot, count existing reservations and calculate remaining capacity
      const slotsWithCapacity = await Promise.all(
        timeSlots.map(async (slot) => {
          // Parse the date string to a Date object for DB query (midnight UTC)
          const slotDate = new Date(slot.date + "T00:00:00Z");

          // Count reservations for this canteen, date, and time
          const reservationCount = await Reservation.countDocuments({
            canteenId: canteen._id,
            date: slotDate,
            time: slot.time,
          });

          return {
            date: slot.date,
            meal: slot.meal,
            startTime: slot.time,
            remainingCapacity: canteen.capacity - reservationCount,
          };
        })
      );

      return {
        canteenId: canteen._id,
        slots: slotsWithCapacity,
      };
    })
  );

  res.status(200).json(result);
});

export const getCanteenByStatus = catchAsync(async (req, res, next) => {
  const { startDate, endDate, startTime, endTime, duration } = req.query;
  const { id } = req.params;

  // Validate required parameters
  if (!startDate || !endDate || !startTime || !endTime || !duration) {
    return next(
      new AppError(
        "Missing required query parameters: startDate, endDate, startTime, endTime, duration",
        400
      )
    );
  }

  const durationInt = Number(duration);

  // Validate duration is 30 or 60
  if (durationInt !== 30 && durationInt !== 60) {
    return next(new AppError("Duration must be 30 or 60 minutes", 400));
  }

  const canteen = await Canteen.findById(id);

  if (!canteen) {
    return next(new AppError("Canteen does not exist", 404));
  }

  // Generate time slots based on query parameters and canteen's working hours
  const timeSlots = generateTimeSlots(
    startDate as string,
    endDate as string,
    startTime as string,
    endTime as string,
    durationInt,
    canteen.workingHours
  );

  // For each slot, count existing reservations and calculate remaining capacity
  const slotsWithCapacity = await Promise.all(
    timeSlots.map(async (slot) => {
      // Parse the date string to a Date object for DB query (midnight UTC)
      const slotDate = new Date(slot.date + "T00:00:00Z");

      // Count reservations for this canteen, date, and time
      const reservationCount = await Reservation.countDocuments({
        canteenId: id,
        date: slotDate,
        time: slot.time,
      });

      return {
        date: slot.date,
        meal: slot.meal,
        startTime: slot.time,
        remainingCapacity: canteen.capacity - reservationCount,
      };
    })
  );

  // Build response
  const response = {
    canteenId: id,
    slots: slotsWithCapacity,
  };

  res.status(200).json(response);
});
