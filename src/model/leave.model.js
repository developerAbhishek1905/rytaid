import mongoose from "mongoose";
const leaveSchema = new mongoose.Schema({
    assinedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    leaveType: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending','approved','rejected'],
      default: 'pending'
    }
  },
  {timestamps: true}
);


export default mongoose.model("Leave", leaveSchema);