import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import analysisRoutes from "./routes/analysisRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import ragRoutes from "./routes/ragRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", analysisRoutes);
app.use("/api", uploadRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api", progressRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});