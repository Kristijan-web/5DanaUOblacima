import mongoose, { InferSchemaType } from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    id: Object,
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
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete (ret as any)._id;
        // delete ret.__v;
        return ret;
      },
    },
  }
);

const Student = mongoose.model("Student", studentSchema);

export type StudentType = InferSchemaType<typeof studentSchema>;

export default Student;
