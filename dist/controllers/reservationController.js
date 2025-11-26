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
    // ovde da pozovem find
    // Sta zelim?
    // - Da proverim da li postoji vec rezervacija u iste vreme u istoj menzi
    // - Ne sme da se napravi novi zapis ako vec postoji
    // Sta je problem?
    // Ne znam gde da pisem logiku za tu proveru, dal u document middleware-u, dal u query middleware-u ili ovde u controller-u?
    // Zasto ne document middleware?
    // - On sadrzi podatke spremne za slanje bazi mogu tu da uzmem id da uradim find
    const reservation = await reservationModel_1.default.create({
        studentId: req.body.studentId,
        canteenId: req.body.canteenId,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
    });
    if (!reservation)
        return next(new appError_1.default("Failed to create reservation", 400));
    (0, sendResponse_1.default)(res, 201, reservation);
});
