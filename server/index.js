import express from "express";
import cors from "cors";
import { createServer } from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import connectToSocket from "./config/socket.js";
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
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error(error));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my API!");
});
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
