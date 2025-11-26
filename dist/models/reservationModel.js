"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../utills/appError"));
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
// @ts-ignore
reservationSchema.pre(
// @ts-ignore
"save", function (next) {
    // Middleware proverava da li je u pitanju rezervacija u proslosti
    const dateTimeString = `${this.date}T${this.time}:00`;
    const reservationTimeStamp = new Date(dateTimeString).getTime();
    const currentTimeStamp = Date.now();
    if (reservationTimeStamp < currentTimeStamp) {
        return next(new Error("Can't create reservation in the past"));
    }
    next();
});
reservationSchema.pre(
// @ts-ignore
"save", function (next) {
    // Middleware koji proverava da li je rezervacija na pola sata ili sat
    const minutes = this.time?.split(":")[1];
    if (minutes === "30" || minutes === "60") {
        next(new appError_1.default("You can only create reservation on full hour or half an hour", 400));
    }
    next();
});
const Reservation = mongoose_1.default.model("Reservation", reservationSchema);
exports.default = Reservation;
// reservationSchema.methods.isReservationInPast = function (
//   date: Date,
//   time: String
// ) {
//   const dateTimeString = `${date}T${time}:00`;
//   const reservationTimeStamp = new Date(dateTimeString).getTime();
//   const currentTimeStamp = Date.now();
//   if (reservationTimeStamp < currentTimeStamp) {
//     return true;
//   }
//   return false;
// };
// reservationSchema.methods.isReservationOnFullHourOrHalfHour = function (
//   time: string
// ) {
//   // Kako da proverim da li je rezervacija na pola sata ili pun sat?
//   // - Ako se zavrsava sa :00 onda je pun sat ako je :30 onda je pola sata sve sto je razlicito je false
//   const minutes = time.split(":")[1];
//   if (minutes === "30" || minutes === "60") {
//     return true;
//   }
//   return false;
// };
