"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservationSchema = new mongoose_1.default.Schema({
    id: Object,
    studentId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    canteenId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Canteen",
        required: true,
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    time: {
        type: String,
        requierd: [true, "Time is required"],
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
    },
}, {
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
reservationSchema.methods.isReservationInPast = function (date, time) {
    const dateTimeString = `${date}T${time}:00`;
    const reservationTimeStamp = new Date(dateTimeString).getTime();
    const currentTimeStamp = Date.now();
    if (reservationTimeStamp < currentTimeStamp) {
        return true;
    }
    return false;
};
const Reservation = mongoose_1.default.model("Reservation", reservationSchema);
exports.default = Reservation;
