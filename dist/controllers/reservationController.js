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
    const canteen = await reservationModel_1.default.create({
        studentId: req.body.studentId,
        canteenId: req.body.canteenId,
        date: req.body.date,
        time: req.body.time,
        duration: req.body.duration,
    });
    if (!canteen)
        return next(new appError_1.default("Failed to create canteen", 400));
    (0, sendResponse_1.default)(res, 201, canteen);
});
