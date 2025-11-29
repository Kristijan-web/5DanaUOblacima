"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanteenByStatus = exports.getCanteensByStatus = exports.deleteCanteen = exports.updateCanteen = exports.createCanteen = exports.getCanteen = exports.getCanteens = void 0;
const CanteenModel_1 = __importDefault(require("../models/CanteenModel"));
const reservationModel_1 = __importDefault(require("../models/reservationModel"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const generateTimeSlots_1 = __importDefault(require("../utills/generateTimeSlots"));
const sendResponse_1 = __importDefault(require("../utills/sendResponse"));
exports.getCanteens = (0, catchAsync_1.default)(async (req, res, next) => {
    const canteens = await CanteenModel_1.default.find();
    (0, sendResponse_1.default)(res, 200, canteens);
});
exports.getCanteen = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const canteen = await CanteenModel_1.default.findById(id);
    if (!canteen) {
        return next(new appError_1.default("Canteen not found", 404));
    }
    (0, sendResponse_1.default)(res, 200, canteen);
});
exports.createCanteen = (0, catchAsync_1.default)(async (req, res, next) => {
    const canteen = await CanteenModel_1.default.create({
        name: req.body.name,
        location: req.body.location,
        capacity: req.body.capacity,
        workingHours: req.body.workingHours,
    });
    if (!canteen) {
        return next(new appError_1.default("Failed to create canteen", 400));
    }
    (0, sendResponse_1.default)(res, 201, canteen);
});
exports.updateCanteen = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    // findByIdAndUpdate ne trigeruje mongoose document middleware
    const updatedCanteen = await CanteenModel_1.default.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedCanteen) {
        return next(new appError_1.default("Something went wrong updating canteen", 400));
    }
    (0, sendResponse_1.default)(res, 200, updatedCanteen);
});
exports.deleteCanteen = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const deletedCanteen = await CanteenModel_1.default.findByIdAndDelete(id);
    if (!deletedCanteen) {
        return next(new appError_1.default("Specified canteen not found!", 404));
    }
    (0, sendResponse_1.default)(res, 204, deletedCanteen);
});
exports.getCanteensByStatus = (0, catchAsync_1.default)(async (req, res, next) => {
    const { startDate, endDate, startTime, endTime, duration } = req.query;
    // Validate required parameters
    if (!startDate || !endDate || !startTime || !endTime || !duration) {
        return next(new appError_1.default("Missing required query parameters: startDate, endDate, startTime, endTime, duration", 400));
    }
    const durationInt = Number(duration);
    // Validate duration is 30 or 60
    if (durationInt !== 30 && durationInt !== 60) {
        return next(new appError_1.default("Duration must be 30 or 60 minutes", 400));
    }
    // Get all canteens
    const canteens = await CanteenModel_1.default.find();
    // Process each canteen
    const result = await Promise.all(canteens.map(async (canteen) => {
        // Generate time slots based on query parameters and canteen's working hours
        const timeSlots = (0, generateTimeSlots_1.default)(startDate, endDate, startTime, endTime, durationInt, canteen.workingHours);
        // For each slot, count existing reservations and calculate remaining capacity
        const slotsWithCapacity = await Promise.all(timeSlots.map(async (slot) => {
            // Parse the date string to a Date object for DB query (midnight UTC)
            const slotDate = new Date(slot.date + "T00:00:00Z");
            // Count reservations for this canteen, date, and time
            const reservationCount = await reservationModel_1.default.countDocuments({
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
        }));
        return {
            canteenId: canteen._id,
            slots: slotsWithCapacity,
        };
    }));
    res.status(200).json(result);
});
exports.getCanteenByStatus = (0, catchAsync_1.default)(async (req, res, next) => {
    const { startDate, endDate, startTime, endTime, duration } = req.query;
    const { id } = req.params;
    // Validate required parameters
    if (!startDate || !endDate || !startTime || !endTime || !duration) {
        return next(new appError_1.default("Missing required query parameters: startDate, endDate, startTime, endTime, duration", 400));
    }
    const durationInt = Number(duration);
    // Validate duration is 30 or 60
    if (durationInt !== 30 && durationInt !== 60) {
        return next(new appError_1.default("Duration must be 30 or 60 minutes", 400));
    }
    const canteen = await CanteenModel_1.default.findById(id);
    if (!canteen) {
        return next(new appError_1.default("Canteen does not exist", 404));
    }
    // Generate time slots based on query parameters and canteen's working hours
    const timeSlots = (0, generateTimeSlots_1.default)(startDate, endDate, startTime, endTime, durationInt, canteen.workingHours);
    // For each slot, count existing reservations and calculate remaining capacity
    const slotsWithCapacity = await Promise.all(timeSlots.map(async (slot) => {
        // Parse the date string to a Date object for DB query (midnight UTC)
        const slotDate = new Date(slot.date + "T00:00:00Z");
        // Count reservations for this canteen, date, and time
        const reservationCount = await reservationModel_1.default.countDocuments({
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
    }));
    // Build response
    const response = {
        canteenId: id,
        slots: slotsWithCapacity,
    };
    res.status(200).json(response);
});
//
// Imacu posebnu tabelu restrikcije
// Ili da embedujem restrikcije u menze
// Ako bih embedovao u canteens
// Onda kada se napravi restrikcija izvrsi se kod koji prolazi kroz rezervacije i proverava vremena i datume svih rezervacija da li postoji ona iz restriction
