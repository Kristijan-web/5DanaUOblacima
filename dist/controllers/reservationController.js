"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = exports.getReservation = exports.getReservations = void 0;
const CanteenModel_1 = __importDefault(require("../models/CanteenModel"));
const reservationModel_1 = __importDefault(require("../models/reservationModel"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const sendResponse_1 = __importDefault(require("../utills/sendResponse"));
exports.getReservations = (0, catchAsync_1.default)(async (req, res, next) => {
    const reservations = await reservationModel_1.default.find();
    (0, sendResponse_1.default)(res, 200, reservations);
});
exports.getReservation = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const reservation = await reservationModel_1.default.findById(id);
    if (!reservation) {
        return next(new appError_1.default("Reservation not found", 404));
    }
    (0, sendResponse_1.default)(res, 200, reservation);
});
exports.createReservation = (0, catchAsync_1.default)(async (req, res, next) => {
    const { studentId, canteenId, date, time, duration } = req.body;
    // Parse the date to midnight UTC for consistent comparison
    const reservationDate = new Date(date);
    const canteen = await CanteenModel_1.default.findById(canteenId);
    if (!canteen) {
        return next(new appError_1.default("Canteen not found", 404));
    }
    // Helper function to convert time string to minutes
    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };
    const reservationStartMinutes = timeToMinutes(time);
    const reservationEndMinutes = reservationStartMinutes + duration;
    // Find the meal type that matches the reservation time
    const matchingMeal = canteen.workingHours.find((wh) => {
        const mealStartMinutes = timeToMinutes(wh.from);
        const mealEndMinutes = timeToMinutes(wh.to);
        // Check if both start and end time are within this meal's working hours
        return (reservationStartMinutes >= mealStartMinutes &&
            reservationEndMinutes <= mealEndMinutes);
    });
    if (!matchingMeal) {
        return next(new appError_1.default("Reservation time must be within canteen working hours for a meal type", 400));
    }
    const mealType = matchingMeal.meal;
    // Check if student already has a reservation at the same canteen, date, and time
    const existingReservation = await reservationModel_1.default.findOne({
        studentId,
        canteenId,
        date: reservationDate,
        time,
    });
    if (existingReservation) {
        return next(new appError_1.default("You already have a reservation at this canteen for this time slot", 400));
    }
    const reservation = await reservationModel_1.default.create({
        studentId,
        canteenId,
        date: reservationDate,
        time,
        duration,
    });
    if (!reservation)
        return next(new appError_1.default("Failed to create reservation", 400));
    const reservationDTO = {
        id: reservation._id,
        studentId: reservation.studentId,
        canteenId: reservation.canteenId,
        date: reservation.date.toISOString().split("T")[0],
        time: reservation.time,
        duration: reservation.duration,
        status: reservation.status,
    };
    (0, sendResponse_1.default)(res, 201, reservationDTO);
});
