// models/city.model.js
import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    city_id: {
      type: Number,
      required: true,
      unique: true
    },
    city_name: {
      type: String,
      required: true
    },
    state_id: {
      type: Number,
      required: true,
      index: true   // fast query
    }
  },
  { timestamps: false }
);

export default mongoose.model("City", citySchema);
