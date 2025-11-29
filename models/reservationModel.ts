import mongoose, {
  CallbackWithoutResultAndOptionalError,
  HydratedDocument,
  InferSchemaType,
  Query,
} from "mongoose";
import AppError from "../utills/appError";
import Canteen from "./CanteenModel";
import Student from "./studentModel";

// interface IreservationMethods {
//   isReservationInPast: (date: Date, time: string) => boolean;
//   isReservationOnFullHourOrHalfHour: (time: string) => boolean;
// }

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
    status: {
      type: String,
      enum: ["Active", "Cancelled", "Completed"],
      default: "Active",
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
  async function (this: HydratedDocument<ReservationType>) {
    // Middleware proverava da li je u pitanju rezervacija u proslosti

    const dateTimeString = `${this.date}T${this.time}:00`;
    const reservationTimeStamp = new Date(dateTimeString).getTime();
    const currentTimeStamp = Date.now();

    if (reservationTimeStamp < currentTimeStamp) {
      return new AppError("Can't create reservation in the past", 400);
    }
  }
);

reservationSchema.pre(
  "save",
  async function (this: HydratedDocument<ReservationType>) {
    // Proverava da li student ima više od 2 rezervacije za isti obrok
    const mealTime = this.time;
    const mealDate = this.date;

    const reservationCount = await Reservation.countDocuments({
      studentId: this.studentId,
      date: mealDate,
      time: mealTime,
      _id: { $ne: this._id },
    });

    if (reservationCount >= 2) {
      return new AppError(
        "Student can't have more than 2 reservations for the same meal",
        400
      );
    }
  }
);

reservationSchema.pre(
  // @ts-ignore
  "save",
  async function (this: HydratedDocument<ReservationType>) {
    // Middleware koji proverava da li je rezervacija na pola sata ili sat
    const minutes = this.time?.split(":")[1];
    if (minutes !== "30" && minutes !== "00") {
      return new AppError(
        "You can only create reservation on full hour or half an hour",
        400
      );
    }
  }
);

reservationSchema.pre("save", async function () {
  // udji u reservations i nadji onu gde se poklapaju id student-a i id canteen-e

  const existing = await Reservation.findOne({
    studentId: this.studentId,
    canteenId: this.canteenId,
    date: this.date,
    time: this.time,
    _id: { $ne: this._id }, // ignorisi trenutni dokument ako postoji
  });

  if (existing) {
    return new AppError(
      "Can't schedule reservation at the same time in the same canteen",
      400
    );
  }
});

reservationSchema.pre(
  // @ts-ignore
  "find",
  function (
    this: Query<ReservationType[], ReservationType>,
    next: CallbackWithoutResultAndOptionalError
  ) {
    // treba da se izvrsi populate za studentId i canteenId
    this.populate({ path: "studentId" }).populate("canteenId");
    next();
  }
);

reservationSchema.methods.doesSameReservationForSameCanteenExist = {
  // Koraci
  // - Uzimam poslat id studenta i canteen-a
  // - Proveravam da li reservations za odredjenu canteen-u postoji ista rezervacija student-a
};

// mozda cak i koristim pre document middleware
// pre nego se napravi zapis u bazi koristim poslate podatke da dohvatim zapis u bazi i proverim da li vec postoji

export type ReservationType = InferSchemaType<typeof reservationSchema>;

const Reservation = mongoose.model<ReservationType>(
  "Reservation",
  reservationSchema
);

export default Reservation;
