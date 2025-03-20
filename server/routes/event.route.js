import express from "express";
import {
  createEvent,
  deleteEvent,
  getallEvents,
  getEvent,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../controller/event.controller.js";
import verifyToken from "../middleware/verify.js";
// import { getDashboardData } from "../controller/user.controller.js";
const route = express.Router();
route.post("/create", verifyToken, createEvent);
route.get("/getallevents", getallEvents);
route.get("/getevent/:id", getEvent);
route.post("/:eventId/join", joinEvent);
route.delete("/:eventId/leave", leaveEvent);
route.put("/:eventId/update",verifyToken, updateEvent);
route.delete("/:eventId/:id/delete",verifyToken,deleteEvent);

// route.get("/dashboard", verifyToken, getDashboardData);
export default route;
