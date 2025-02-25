import express from "express";
import authRoute from "./routes/auth.route.js";
import cors from "cors";
import { createServer } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import eventRoute from "./routes/event.route.js";
import cookieParser from "cookie-parser";
import connectToSocket from "./config/socket.js";
dotenv.config();
const app = express();
const server = createServer(app);
const io = connectToSocket(server);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET, POST, PUT, DELETE",
  })
);
app.use(cookieParser());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error(error));
app.use(express.json());
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.use("/api", authRoute);
app.use("/api", eventRoute);
app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
