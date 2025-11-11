import express from "express";
import Intent from "../models/intent.js";

const router = express.Router();

// GET intent answer by name
router.get("/:intentName", async (req, res) => {
  try {
    const intentName = req.params.intentName;
    const data = await Intent.findOne({ intent: intentName });

    if (!data) {
      return res.json({ long_answer: "No data found for this intent." });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
