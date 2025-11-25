import mongoose, { InferSchemaType } from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

const Student = mongoose.model("Student", studentSchema);

export type StudentType = InferSchemaType<typeof studentSchema>;

export default Student;
