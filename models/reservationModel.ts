import mongoose, {
  CallbackWithoutResultAndOptionalError,
  HydratedDocument,
  InferSchemaType,
} from "mongoose";
import AppError from "../utills/appError";

interface IreservationMethods {
  isReservationInPast: (date: Date, time: string) => boolean;
  isReservationOnFullHourOrHalfHour: (time: string) => boolean;
}

const reservationSchema = new mongoose.Schema(
  {
    id: Object,
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    canteenId: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// @ts-ignore
reservationSchema.pre(
  // @ts-ignore
  "save",
  function (
    this: HydratedDocument<ReservationType>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    // Middleware proverava da li je u pitanju rezervacija u proslosti

    const dateTimeString = `${this.date}T${this.time}:00`;
    const reservationTimeStamp = new Date(dateTimeString).getTime();
    const currentTimeStamp = Date.now();

    if (reservationTimeStamp < currentTimeStamp) {
      return next(new Error("Can't create reservation in the past"));
    }

    next();
  }
);

reservationSchema.pre(
  // @ts-ignore
  "save",
  function (
    this: HydratedDocument<ReservationType>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    // Middleware koji proverava da li je rezervacija na pola sata ili sat
    const minutes = this.time?.split(":")[1];
    if (minutes === "30" || minutes === "60") {
      next(
        new AppError(
          "You can only create reservation on full hour or half an hour",
          400
        )
      );
    }
    next();
  }
);

export type ReservationType = InferSchemaType<typeof reservationSchema> &
  IreservationMethods;

const Reservation = mongoose.model<ReservationType>(
  "Reservation",
  reservationSchema
);

export default Reservation;

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
