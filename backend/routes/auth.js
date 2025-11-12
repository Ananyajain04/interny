import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email.endsWith("@vitstudent.ac.in")) {
      return res.status(400).json({ message: "Only vitstudent.ac.in emails allowed" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "Signup successful", token });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email.endsWith("@vitstudent.ac.in")) {
      return res.status(400).json({ message: "This user is not accepted. Only VIT students allowed" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No such user" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ message: "Login successful", token });

  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
