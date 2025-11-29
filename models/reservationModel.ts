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
    // this imam narudzbinu

    const studentResevartions = await Reservation.find({
      studentId: this.id,
      date: { $gt: new Date() },
    });
    // ne sme da napravi dve rezervacije u isto vreme
    const dateTimeString = `${this.date}T${this.time}:00`;
    const currentReservationTimeStamp = new Date(dateTimeString).getTime();

    // studentResevartions.forEach(reservation => {
    //   const canteen = reservation.
    // })

    // Imam sve studentove rezervacije i treba da proverim da li se trenutna rezervacija poklapa

    // da li se currentTimestamp nalazi izmedju timestampa from i to za jelo

    // Koji podaci mi fale
    // - Mora da se uzme vreme from to za timestamp (canteen) kome pripada rezervacija
    // - Kako cu da znam da li je dohvacena rezervacija za dorucak rucak ili veceru (mora da se vrsi provera )
    // - da li se timestamp za rezervaciju iz baze nalazi izmedjju timestamp-a

    // kaako mi izgleda objekat rezervacije
    //     {
    //     "id": "692b1bcbdb14b9f2c479d29d",
    //     "studentId": "692b1bb7db14b9f2c479d283",
    //     "canteenId": "692b1bbedb14b9f2c479d285",
    //     "date": "2025-12-01",
    //     "time": "08:00",
    //     "duration": 30,
    //     "status": "Active"
    // }
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
  async function (this: Query<ReservationType[], ReservationType>) {
    // treba da se izvrsi populate za studentId i canteenId
    this.populate({ path: "studentId" }).populate("canteenId");
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
