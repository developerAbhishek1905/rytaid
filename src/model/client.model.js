import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";

const clientSchema = new mongoose.Schema(
  {
   
    companyInfo: {
      companyName: {
        type: String,
        required: true,
      },
      // companyAddress: {
      //   type: String,
      //   required: true,
      // },
      companyPhone: {
        type: String,
        required: true,
      },
      companyEmail: {
        type: String,
        required: true,
        unique: true,
      },
      companyWebsite: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      streetAdreess1: {
        type: String,
        required: true,
      },
      // streetAdreess2: {
      //   type: String,
      //   required: true,
      // },
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
        required: true,
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        required: true,
      },
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true,
      },
      pincode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pincode",
        required: true,
      },
      note: {
        type: String,
      },
      img: {
        type: String,
        default: null,
      },
      primeryContactFirstName: {
        type: String,
        required: true,
      },
      primeryContactLastName: {
        type: String,
        required: true,
      },
      primeryContactEmail: {
        type: String,
        required: true,
      },
      primeryContactPhone: {
        type: String,
        required: true,
      },
    },
    individualInfo: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        required: true,
        unique: true,
      },
      individaul_website:{
        type: String,
      },
      individaul_address: {
        type: String,
      },
      individaul_streetAdreess1: {
        type: String,
      },
      // streetAdreess2: {
      //   type: String,
      // },
      individual_country: {
        type: String,
      },
      individual_state: {
        type: String,
      },
      individual_city: {
        type: String,
      },
      individual_pincode: {
        type: String,
      },
      individual_note: {
        type: String,
      },
      individaul_img: {
        type: String,
        default: null,
      },
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
  
      default: "client",
    },
    invites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invite",
  },
],
  },
  { timestamps: true },
);

// Password hash
clientSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
clientSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const Client = mongoose.model("Client", clientSchema);
