import mongoose from "mongoose";
const siteSchema = new mongoose.Schema(
  {
    site_id: {
      type: Number,
      required: true,
      unique: true
    },
    site_name: {
      type: String,
      required: true
    },
    client_id: [{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Client",
    }],
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      index: true
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      index: true
    },
    state_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      index: true
    },
    pincode_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pincode",
      index: true
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    geofancing: {
      type: String,
    },
    notes: {
      type: String,
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    }],
    status: {
      type: String,
      enum: ['pending','approved','rejected'],
      default: 'pending'
    },
    tasks: [],
    
  },
  { timestamps: false }
);
export default mongoose.model("Site", siteSchema);