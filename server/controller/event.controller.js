import errorHandler from "../middleware/error.js";
import { io } from "../config/socket.js";
import Event from "../model/event.model.js";
import mongoose from "mongoose";
import admin from "../firebase-admin.js";
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      month,
      time,
      date,
      category,
      location,
      hostedBy,
      imageUrl,
    } = req.body;
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      month,
      category,
      hostedBy,
      image: imageUrl,
    });
    return res.status(201).json(newEvent);
  } catch (error) {
    console.log("error", error);
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
export const leaveEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    // 1. Validate Input
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return errorHandler(res, 400, "Invalid event ID");
    }

    // 2. Find Event
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return errorHandler(res, 404, "Event not found");
    }

    // 3. Check User Registration
    const userIndex = existingEvent.attendances.findIndex(
      (attendance) => attendance.id === userId
    );

    if (userIndex === -1) {
      return errorHandler(res, 400, "User not registered");
    }

    existingEvent.attendances.splice(userIndex, 1);
    await existingEvent.save();
    io.to(eventId).emit("attendanceUpdated", existingEvent.attendances);
    res.status(200).json({ message: "Unregistered successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  const { eventId } = req.params;
  const {
    title,
    description,
    month,
    time,
    date,
    category,
    location,
    status,
    hostedBy,
    updateMessage,
    image,
  } = req.body;
  console.log("image", updateMessage);
  const userEmail = req.user.email;
  try {
    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return errorHandler(res, 404, "Event not found");
    }
    if (existingEvent.hostedBy !== userEmail) {
      return errorHandler(res, 403, "Not authorized to update this event");
    }
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (month) updates.month = month;
    if (time) updates.time = time;
    if (date) updates.date = date;
    if (category) updates.category = category;
    if (location) updates.location = location;
    if (status) updates.status = status;
    if (hostedBy) updates.hostedBy = hostedBy;
    if (image) {
      console.log("image", image);
      updates.image = image;
    }
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });
    io.to(eventId).emit("eventUpdated", updatedEvent);

    res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    next(error);
  }
};

// if (updateMessage) {
//   const tokens = updatedEvent.attendances
//     .map((sub) => sub.FCM)
//     .filter((token) => !!token);

//   if (tokens.length > 0) {
//     const message = {
//       tokens,
//       notification: {
//         title: "Event Updated!",
//         body: updateMessage,
//       },
//       webpush: {
//         fcmOptions: {
//           link: `http://localhost:5173/event/${eventId}`,
//         },
//       },
//     };
//     const response = await admin.messaging().sendEachForMulticast(message);
//     console.log("notification response is", response)
//     console.log(`${response.successCount} notification send successfully`);
//   }
