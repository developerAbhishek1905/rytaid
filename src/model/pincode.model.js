// models/pincode.model.js
import mongoose from "mongoose";

const pincodeSchema = new mongoose.Schema(
  {
    pincode_id: {
      type: Number,
      required: true,
      unique: true
    },
    pincode: {
      type: String,
      required: true
    },
    city_id: {
      type: Number,
      required: true,
      index: true
    }
  },
  { timestamps: false }
);

export default mongoose.model("Pincode", pincodeSchema);
