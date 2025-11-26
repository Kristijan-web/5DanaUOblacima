"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = exports.getReservation = exports.getReservations = void 0;
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
    const reservation = await reservationModel_1.default.create({
        studentId: req.body.studentId,
        canteenId: req.body.canteenId,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
    });
    // NE valja sto ispod koristim intance metode
    // Bolje je koristeci pre document middlware da izvrsi proveru podataka pre nego sto su uopste poslati u bazu
    // Ovde proveravam podatke nakon sto su vraceni iz baze
    if (!reservation)
        return next(new appError_1.default("Failed to create reservation", 400));
    if (reservation.isReservationInPast(req.body.date, req.body.time)) {
        await reservation.deleteOne();
        return next(new appError_1.default("Can't make reservation in the past", 400));
    }
    if (!reservation.isReservationOnFullHourOrHalfHour) {
        return next(new appError_1.default("You can only create reservation on full hour or half an hour", 400));
    }
    // Student ne bih trebao da moze da napravi istu rezervaciju za isti vremenski interval?
    // - Mora da se ode u bazu i proveri da li postoji rezervacija sa studentskim id-em u reservations kolekciji
    // mogu da koristim post document middlware, koji ce se izvrsiti nad vracenim document-om iz baze
    (0, sendResponse_1.default)(res, 201, reservation);
});
// Pretvori _id u id
