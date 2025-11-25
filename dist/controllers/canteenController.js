"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCanteen = void 0;
const CanteenModel_1 = __importDefault(require("../models/CanteenModel"));
const appError_1 = __importDefault(require("../utills/appError"));
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
const sendResponse_1 = __importDefault(require("../utills/sendResponse"));
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
