import express from "express";
import CompanyIntake from "../models/companyIntake.js";

const router = express.Router();

// all companies
router.get("/", async (req, res) => {
  const data = await CompanyIntake.find();
  res.json(data);
});

// single company
router.get("/:name", async (req, res) => {
  const data = await CompanyIntake.findOne({ company: req.params.name });
  res.json(data);
});

export default router;
