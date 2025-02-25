import express from "express";
import {
  createEvent,
  getallEvents,
  getEvent,
} from "../controller/event.controller.js";
import verifyToken from "../middleware/verify.js";
const route = express.Router();
route.post("/create", verifyToken, createEvent);
route.get("/getallevents", getallEvents);
route.get("/getevent/:id", getEvent);
export default route;
