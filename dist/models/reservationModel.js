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
// reservationSchema.pre<
//   HydratedDocument<ReservationType>, // tip dokumenta
//   CallbackWithoutResultAndOptionalError // tip next-a
// >(`save`, async function (next: CallbackWithoutResultAndOptionalError) {
//   // const dateTimeString = `${this.date}T${this.time}:00`;
//   // const reservationTimeStamp = new Date(dateTimeString).getTime();
//   // const currentTimeStamp = Date.now();
//   // if (reservationTimeStamp < currentTimeStamp) {
//   //   return next(new AppError("Can't create reservations in the past", 400));
//   // }
//   next();
// });
// reservationSchema.pre(
//   "save",
//   function (
//     this: HydratedDocument<ReservationType>,
//     next: CallbackWithoutResultAndOptionalError
//   ) {
//     const isoDate = this.date.toISOString().split("T")[0];
//     const dateTimeString = `${isoDate}T${this.time}:00`;
//     const reservationTS = new Date(dateTimeString).getTime();
//     const now = Date.now();
//     if (reservationTS < now) {
//       throw new AppError("Can't create reservations in the past", 400);
//     }
//     next();
//   }
// );
// @ts-ignore
reservationSchema.pre(
// @ts-ignore
"save", function (next) {
    // "this" predstavlja dokument koji se snima u bazu
    console.log("Pre-save middleware radi");
    // primer — validacija datuma
    const dateTimeString = `${this.date}T${this.time}:00`;
    const reservationTimeStamp = new Date(dateTimeString).getTime();
    const currentTimeStamp = Date.now();
    if (reservationTimeStamp < currentTimeStamp) {
        return next(new Error("Can't create reservation in the past"));
    }
    next();
});
// reservationSchema.pre<
//   HydratedDocument<ReservationType>,
//   CallbackWithoutResultAndOptionalError
// >(
//   "init",
//   function (
//     this: HydratedDocument<ReservationType>,
//     next: CallbackWithoutResultAndOptionalError
//   ) {
//     const isoDate = this.date.toISOString().split("T")[0];
//     const dateTimeString = `${isoDate}T${this.time}:00`;
//     const reservationTS = new Date(dateTimeString).getTime();
//     const now = Date.now();
//     if (reservationTS < now) {
//       return next(new AppError("Can't create reservations in the past", 400));
//     }
//     next();
//   }
// );
reservationSchema.methods.isReservationInPast = function (date, time) {
    const dateTimeString = `${date}T${time}:00`;
    const reservationTimeStamp = new Date(dateTimeString).getTime();
    const currentTimeStamp = Date.now();
    if (reservationTimeStamp < currentTimeStamp) {
        return true;
    }
    return false;
};
reservationSchema.methods.isReservationOnFullHourOrHalfHour = function (time) {
    // Kako da proverim da li je rezervacija na pola sata ili pun sat?
    // - Ako se zavrsava sa :00 onda je pun sat ako je :30 onda je pola sata sve sto je razlicito je false
    const minutes = time.split(":")[1];
    if (minutes === "30" || minutes === "60") {
        return true;
    }
    return false;
};
const Reservation = mongoose_1.default.model("Reservation", reservationSchema);
exports.default = Reservation;
