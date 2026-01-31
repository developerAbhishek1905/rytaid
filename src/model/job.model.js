import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    
assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    site_id:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    }],
    client:{
        type: mongoose.Schema.Types.ObjectId,  
        ref: "Client",
        required: true,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending','approved','rejected'],
      default: 'pending'
    },
    startDate: {
    type: Date,
    required: true,
    },
    endDate: {
      
    type: Date,
    required: true,
    },
    startTime: {
    type: String,
    required: true,
    },
    endTime: {
    type: String,
    required: true,
    },
    Duration: {
    type: String,
    // required: true,
    },
    punchIn: {
    type: String,
    default: null,
    },
    punchOut: {
    type: String,
    default: null,
    },
    devicesUsed: {
    type: String,
    default: null,
    },
    afterPhoto: [{
    type: String,
    default: null,
  }],
  beofePhoto: [{
    type: String,
    default: null,
  }],
  latitude: {
    type: String,
    default: null,
  },
  longitude: {
    type: String,
    default: null, 
  }

  },
  
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);