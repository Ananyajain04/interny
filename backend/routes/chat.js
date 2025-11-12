import express from "express";
import axios from "axios";
import Intent from "../models/intent.js";
import CompanyIntake from "../models/companyIntake.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

router.post("/",authMiddleware, async (req, res) => {
  const { message, depth = "short", sender = "web" } = req.body;

  // Store last detected intent per user
  if (!global.lastIntentMap) {
    global.lastIntentMap = new Map();
  }

  try {
    let intent;
    let entities = [];

    // If user clicked "Show more"
    if (message === "__DETAILS__") {
      intent = global.lastIntentMap.get(sender);

      if (!intent) {
        return res.json({
          reply: "I can’t expand yet — ask something first!",
          intent: null,
        });
      }
    } else {
      // Normal Rasa call
      const rasaResponse = await axios.post(
        "http://localhost:5005/model/parse",
        { text: message }
      );

      intent = rasaResponse.data.intent?.name;
      entities = rasaResponse.data.entities || [];

      // Save intent for that user
      if (intent) global.lastIntentMap.set(sender, intent);
    }

    // If intent missing
    if (!intent) {
      return res.json({
        reply: "Sorry, I couldn't understand that.",
        intent: null,
      });
    }

    // Handle company-specific cases
    if (intent === "company_specific_intake") {
      const company = entities.find((e) => e.entity === "company")?.value;

      if (company) {
        const data = await CompanyIntake.findOne({
          company: { $regex: new RegExp(`^${company}$`, "i") },
        });

        if (!data) {
          return res.json({ reply: `No data found for ${company}.`, intent });
        }

        let reply = `📌 ${data.company} Internship Details**\n`;

        reply += `\nInternships: ${data.internships}`;
        reply += `\nFull-time Offers: ${data.fulltime}`;
        reply += `\nMonth: ${data.month}`;
        reply += `\nCGPA Cutoff: ${data.cgpa_cutoff}`;

        if (data.drive_mode) {
          reply += `\nDrive Mode: ${data.drive_mode}`;
        }

        if (data.eligibility_branches?.length > 0) {
          reply += `\nEligible Branches: ${data.eligibility_branches.join(
            ", "
          )}`;
        }

        reply += `\nArrears Allowed: ${data.arrears_allowed ? "Yes" : "No"}`;
        reply += `\nAcademic Gap Allowed: ${
          data.academic_gap_allowed ? "Yes" : "No"
        }`;

        // OPTIONAL FIELDS — only if present
        if (data.shortlist_released) {
          reply += `\nhortlist Released: ${data.shortlist_released}`;
        }

        if (data.stipend) {
          reply += `\nStipend: ${data.stipend}`;
        }

        reply += `\nNotes: ${data.notes}`;
        reply += `\nLast Updated: ${data.last_updated}`;

        return res.json({ reply, intent });
      }
    }

    // Fetch intent data (short + long answers)
    if (intent == "emotional_support") {
      const reply =
        "I’m really sorry you’re feeling this way. It’s totally valid to feel upset—this stuff is stressful. Remember: an internship or a single season isn’t the whole story. Keep your basics steady, lean on your support system, and give yourself credit for the effort you’re putting in. If things feel heavy for a while, consider talking to someone you trust or a counselor.\n\nWant some quick tips for managing prep + stress right now?";
      return res.json({ reply, intent, depth: "long" });
    }
    if (intent === "greet") {
      return res.json({
        reply:
          "Hi! I'm VITgpt — your internship guidance assistant. How can I help you today?",
        intent,
        depth: "short",
      });
    }
    if (intent === "user_introduction") {
      return res.json({
        reply:
          "Nice to meet you! I'm VITgpt — I help you with internship information, company details, tips, preparation guidance, and more. Ask me anything!",
        intent,
        depth: "short",
      });
    }
    if (intent === "goodbye") {
      return res.json({
        reply:
          "You're welcome! Take care — and feel free to come back anytime if you have more questions. Bye!",
        intent,
        depth: "short",
      });
    }

    const intentData = await Intent.findOne({ intent });

    if (!intentData) {
      return res.json({
        reply: "Sorry, I don't have data on that yet!",
        intent,
      });
    }

    // Decide short or long
    const wantsLong =
      depth === "long" ||
      /\b(detail|details|explain|why|more)\b/i.test(message);

    const reply = wantsLong
      ? intentData.long_answer || intentData.short_answer
      : intentData.short_answer;

    return res.json({ reply, intent, depth: wantsLong ? "long" : "short" });
  } catch (err) {
    console.error("Chat error:", err);
    return res.json({ reply: "Server error. Try again later.", intent: null });
  }
});

export default router;
