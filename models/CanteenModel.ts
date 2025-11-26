import mongoose, { InferSchemaType } from "mongoose";

const canteenSchema = new mongoose.Schema(
  {
    id: {
      type: Object,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "Canteen name must be unique"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    workingHours: {
      type: [
        {
          meal: { type: String, required: true },
          from: { type: String, required: true },
          to: { type: String, required: true },
        },
      ],
      required: true,
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

const Canteen = mongoose.model("Canteen", canteenSchema);

export type canteenType = InferSchemaType<typeof canteenSchema>;

export default Canteen;
