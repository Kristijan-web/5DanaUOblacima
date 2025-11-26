import mongoose, { InferSchemaType } from "mongoose";

interface IreservationMethods {
  isReservationInPast: (date: Date, time: string) => boolean;
}

const reservationSchema = new mongoose.Schema({
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
});

reservationSchema.methods.isReservationInPast = function (
  date: Date,
  time: String
) {
  const dateTimeString = `${date}T${time}:00`;

  const reservationTimeStamp = new Date(dateTimeString).getTime();
  const currentTimeStamp = Date.now();

  if (reservationTimeStamp < currentTimeStamp) {
    return true;
  }
  return false;
};

export type ReservationType = InferSchemaType<typeof reservationSchema> &
  IreservationMethods;

const Reservation = mongoose.model<ReservationType>(
  "Reservation",
  reservationSchema
);

export default Reservation;
