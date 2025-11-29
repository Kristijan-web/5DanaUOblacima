"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestriction = void 0;
const reservationModel_1 = __importDefault(require("../models/reservationModel"));
const restrictionModel_1 = __importDefault(require("../models/restrictionModel"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const snsMail_1 = require("../utills/snsMail");
exports.createRestriction = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id: canteenId } = req.params;
    const restriction = await restrictionModel_1.default.create(req.body);
    if (!restriction) {
        return next(new appError_1.default("Failed to create restriction", 400));
    }
    (0, snsMail_1.sendCancellationNotification)({
        studentEmail: "krimster8@gmail.com",
        canteenName: "testt",
        reservationTime: "20",
    });
    const restrictionStartDate = restriction.startDate;
    const restrictionEndDate = restriction.endDate;
    const reservations = await reservationModel_1.default.find({ canteen: canteenId });
    // Treba proci kroz sve rezervacije i vratiti one koje ne ispunjavaju uslov restrikcije
    const invalidReservatiosn = reservations.map((reservation) => { });
});
//
