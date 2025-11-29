"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const restrictionSchema = new mongoose_1.default.Schema({
    startDate: {
        type: Date,
        required: [true, "Start date is required"],
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"],
    },
    workingHours: [
        {
            meal: String,
            from: String,
            to: String,
        },
    ],
});
const Restriction = mongoose_1.default.model("Restriction", restrictionSchema);
exports.default = Restriction;
