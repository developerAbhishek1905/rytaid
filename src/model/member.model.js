// models/Member.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const memberSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: false, // SAME _id from Invite
    },

    firstName: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      required: true,
    },

    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
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
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
    pincode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pincode",
    },
    assignTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      // required: true,
    },

    password: { type: String, required: true },

    
  },
  { timestamps: true },
);

memberSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Member", memberSchema);
