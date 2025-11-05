import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import CompanyIntake from "./models/companyIntake.js";
import Intent from "./models/intent.js";

dotenv.config();

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear old data
    await CompanyIntake.deleteMany({});
    await Intent.deleteMany({});

    // Load JSON files
    const companyData = JSON.parse(fs.readFileSync("./companyIntake.json", "utf8"));
    const intentData = JSON.parse(fs.readFileSync("./intent.json", "utf8"));

    // Insert
    await CompanyIntake.insertMany(companyData);
    await Intent.insertMany(intentData);

    console.log("✅ Data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seedDatabase();
