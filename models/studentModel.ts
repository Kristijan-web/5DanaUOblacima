import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  ime: String,
  prezime: String,
  email: String,
});

const studentModel = mongoose.model("student", studentSchema);

export default studentModel;
