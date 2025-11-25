import mongoose, { InferSchemaType } from "mongoose";

const reservationSchema = new mongoose.Schema({
  // studentId mora biti mongodb id
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

const Reservation = mongoose.model("Reservation", reservationSchema);

export type ReservationType = InferSchemaType<typeof reservationSchema>;

export default Reservation;
