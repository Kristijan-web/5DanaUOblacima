"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const canteenSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: [true, "Canteen name must be unique"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
    },
    workingHours: {
        type: {
            meal: String,
            from: String,
            to: String,
        },
        required: [true, "Working hours are required"],
    },
});
const Canteen = mongoose_1.default.model("Canteen", canteenSchema);
exports.default = Canteen;
