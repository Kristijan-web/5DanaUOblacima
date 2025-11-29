"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestriction = void 0;
const reservationModel_1 = __importDefault(require("../models/reservationModel"));
const Restriction_1 = __importDefault(require("../models/Restriction"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
exports.createRestriction = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id: canteenId } = req.params;
    const restriction = await Restriction_1.default.create(req.body);
    if (!restriction) {
        return next(new appError_1.default("Failed to create restriction", 400));
    }
    const restrtictionStartDate = restriction?.startDate;
    const restrictionEndDate = restriction?.endDate;
    const reservatiosn = await reservationModel_1.default.find({ canteen: canteenId });
    // kada treba izvrsiti loguiku
    // - Nakon pravljenje restriction
    //   const canteen = await Canteen.findById(canteenId);
    // Pravljenje restriction logike
    // - Napravi se nova restrikcija to mora
    // Sta se desava nakon sto se napravi nova restrikcija
    // Ulazi se u reservations i prolazi kroz sve rezervacije i brisu se one koje su u konfliktu sa restriction
});
