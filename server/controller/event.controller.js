import errorHandler from "../middleware/error.js";
import { io } from "../config/socket.js";
import Event from "../model/event.model.js";
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, month, time, date, category, location } =
      req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      month,
      category,
      hostedBy: req.user.id,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};
export const getallEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};
export const getEvent = async (req, res, next) => {
  const eventId = req.params.id;
  console.log(eventId);
  const singleEvent = await Event.findById(eventId);
  res.status(200).json(singleEvent);
};
export const joinEvent = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const { userId, fullName } = req.body;

    const existingEvent = await Event.findById(eventId);

    // Check if event exists
    if (!existingEvent) {
      return errorHandler(res, 404, "Event not found");
    }

    // Check if user is already registered
    const userAlreadyRegistered = existingEvent.attendances.some(
      (attendance) => attendance.id === userId
    );

    if (userAlreadyRegistered) {
      return errorHandler(res, 400, "User already registered");
    }
    // Add user to the event
    existingEvent.attendances.push({ id: userId, fullName });
    await existingEvent.save();
    // Emit socket event
    io.to(eventId).emit("attendanceUpdated", existingEvent.attendances);

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};
