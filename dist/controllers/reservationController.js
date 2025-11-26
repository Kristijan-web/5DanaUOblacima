"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReservation = void 0;
const reservationModel_1 = __importDefault(require("../models/reservationModel"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const sendResponse_1 = __importDefault(require("../utills/sendResponse"));
exports.createReservation = (0, catchAsync_1.default)(async (req, res, next) => {
    // Nije dozvoljeno kreirati rezervaciju za dane u prošlosti.
    // Znaci treba da uzmem canteenId
    // Mora da napravim timestamp od prosledjenog datuma i vremena i onda da proverim da li je timestmap manji od sadasnjeg vremena
    // "date": "2025-12-01",
    // "time": "07:30
    console.log("EVO ID-EVA", req.body.studentId, req.body.canteenId);
    const reservation = await reservationModel_1.default.create({
        studentId: req.body.studentId,
        canteenId: req.body.canteenId,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
    });
    if (!reservation)
        return next(new appError_1.default("Failed to create reservation", 400));
    if (reservation.isReservationInPast(req.body.date, req.body.time))
        await reservation.deleteOne();
    (0, sendResponse_1.default)(res, 201, reservation);
});
// Pretvori _id u id
