import mongoose from "mongoose";

const CompanyIntakeSchema = new mongoose.Schema({
  company: String,
  internships: Number,
  fulltime: Number,
  month: String,
  cgpa_cutoff: String,
  eligibility_branches: [String],
  stipend: String,
  drive_mode: String,
  arrears_allowed: Boolean,
  academic_gap_allowed: Boolean,
  shortlist_released: String,
  notes: String,
  last_updated: String
});

export default mongoose.model("CompanyIntake", CompanyIntakeSchema);
