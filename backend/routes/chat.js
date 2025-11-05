import express from "express";
import axios from "axios";
import Intent from "../models/intent.js";
import CompanyIntake from "../models/companyIntake.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  // Send to Rasa to detect intent and entity
  const rasaResponse = await axios.post(process.env.RASA_URL, {
    sender: "user",
    message
  });

  const rasaMsg = rasaResponse.data[0];
  const detectedIntent = rasaMsg.intent.name;
  const company = rasaMsg.entities?.find(e => e.entity === "company")?.value;

  // If query is company specific
  if (detectedIntent === "company_specific_intake" && company) {
    const data = await CompanyIntake.findOne({ company: { $regex: new RegExp(company, "i") }});
    if (data) return res.json({ reply: `${company} selected ${data.internships} interns in ${data.month}. CGPA cutoff: ${data.cgpa_cutoff}. Notes: ${data.notes}`});
    return res.json({ reply: `No data found for ${company}.`});
  }

  // Otherwise fetch regular intent
  const result = await Intent.findOne({ intent: detectedIntent });
  if (result) return res.json({ reply: result.short_answer });

  return res.json({ reply: "Sorry, I don't have data on that yet!" });
});

export default router;
