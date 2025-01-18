import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.get("/system-status", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
