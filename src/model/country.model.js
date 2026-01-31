// country.model.js
import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    country_id: {
      type: Number,
      required: true,
      unique: true
    },
    name: String,
    code: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

countrySchema.virtual("states", {
  ref: "State",              // ⬅️ Model name (exact same)
  localField: "country_id",  // ⬅️ Country field
  foreignField: "country_id" // ⬅️ State field
});

export default mongoose.model("Country", countrySchema);
