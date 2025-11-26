"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanteensByStatus = exports.deleteCanteen = exports.updateCanteen = exports.createCanteen = exports.getCanteen = exports.getCanteens = void 0;
const CanteenModel_1 = __importDefault(require("../models/CanteenModel"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
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
    const { startDate, startTime, endDate, endTime, duration } = req.query;
});
