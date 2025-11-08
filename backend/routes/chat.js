import express from "express";
import axios from "axios";
import Intent from "../models/intent.js";
import CompanyIntake from "../models/companyIntake.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    // Ask Rasa to parse message
    const rasaResponse = await axios.post(
      "http://localhost:5005/model/parse",
      { text: message }
    );

    const intent = rasaResponse.data.intent?.name;
    const entities = rasaResponse.data.entities || [];

    // Extract company name if present
    const company = entities.find(e => e.entity === "company")?.value;

    if (!intent) {
      return res.json({ reply: "Sorry, I couldn't understand that." });
    }

    // Handle company-specific queries
    if (intent === "company_specific_intake" && company) {
      const data = await CompanyIntake.findOne({
        company: { $regex: new RegExp(`^${company}$`, "i") }
      });

      if (!data) {
        return res.json({ reply: `No data found for ${company}.` });
      }

      return res.json({
        reply: `${data.company} selected ${data.internships} interns.\nMonth: ${data.month}\nCGPA Cutoff: ${data.cgpa_cutoff}\nNotes: ${data.notes}`
      });
    }

    // Otherwise fetch intent reply from DB
    const intentData = await Intent.findOne({ intent });

    if (intentData) {
      return res.json({ reply: intentData.short_answer });
    }

    return res.json({ reply: "Sorry, I don't have data on that yet!" });

  } catch (err) {
    console.error("Chat error:", err);
    return res.json({ reply: "Server error. Try again later." });
  }
});

export default router;
