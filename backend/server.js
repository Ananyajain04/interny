import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));

import chatRoutes from "./routes/chat.js";
import companyRoutes from "./routes/company.js";
import intentRoutes from "./routes/intent.js";


app.use("/chat", chatRoutes);
app.use("/company", companyRoutes);
app.use("/intent", intentRoutes);


app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
