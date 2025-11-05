import mongoose from "mongoose";

const IntentSchema = new mongoose.Schema({
  intent: String,
  short_answer: String,
  long_answer: String,
  last_updated: String
});

export default mongoose.model("Intent", IntentSchema);
