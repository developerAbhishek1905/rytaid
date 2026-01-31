import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: null,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },

    role: {
      type: String,
      enum: ["member", "super_admin", "user"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role === "member";
      },
    },

    position: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    enforcedScheduledJobs: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: null,
    },
    streetAddress: {
      type: String,
      default: null,
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

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    officeId: {
      type: String,

      default: null,
    },
    totalWorkedHours: {
      type: Number,
      default: 0,
    },
    completedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        default: 0,
      },
    ],
  },
  { timestamps: true },
);

// Password hash
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
