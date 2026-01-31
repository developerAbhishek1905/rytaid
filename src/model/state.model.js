import mongoose from "mongoose";


const stateSchema = new mongoose.Schema({
  state_id: {
    type: Number,
    unique: true,
    required: true
  },
  active: String,
  state_name: String,
  country_id: {
    type: Number,
    required: true
  }
});

export default mongoose.model("State", stateSchema);
