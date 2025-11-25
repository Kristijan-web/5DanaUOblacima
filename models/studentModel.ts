import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  ime: String,
  prezime: String,
  email: String,
  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student",
  },
});

const studentModel = mongoose.model("student", studentSchema);

export default studentModel;
