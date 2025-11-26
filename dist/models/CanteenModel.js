"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const canteenSchema = new mongoose_1.default.Schema({
    id: {
        type: Object,
    },
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
        type: [
            {
                meal: { type: String, required: true },
                from: { type: String, required: true },
                to: { type: String, required: true },
            },
        ],
        required: true,
    },
}, {
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            // delete ret.__v;
            return ret;
        },
    },
});
const Canteen = mongoose_1.default.model("Canteen", canteenSchema);
exports.default = Canteen;
