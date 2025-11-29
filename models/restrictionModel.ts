import mongoose, { InferSchemaType } from "mongoose";

const restrictionSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  workingHours: [
    {
      meal: String,
      from: String,
      to: String,
    },
  ],
});
export type RestrictionType = InferSchemaType<typeof restrictionSchema>;

const Restriction = mongoose.model<RestrictionType>(
  "Restriction",
  restrictionSchema
);
export default Restriction;
