// models/Invite.js
import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: false, // IMPORTANT: we control _id
    },

    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true},
    role: {
      type: String,
      default: "member",
    },
    note: String,

    address: String,
    streetAddress: String,

    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
    },
    state:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
    },
    pincode:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pincode",
    },

    token: { type: String, required: true }, // invite token
    expiresAt: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      // required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invite", inviteSchema);
