"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudent = void 0;
const catchAsync_1 = __importDefault(require("../utills/catchAsync"));
exports.createStudent = (0, catchAsync_1.default)(async (req, res, next) => {
    console.log("Upao u create student controller");
});
