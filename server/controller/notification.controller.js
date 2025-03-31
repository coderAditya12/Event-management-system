
import Event from "../model/event.model.js";
import errorHandler from "../middleware/error.js";
import admin from "../firebase-admin.js";

// Subscribe to event notifications (add to attendances)
export const subscribe = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId, token, fullName } = req.body; // Get from request body

    const event = await Event.findById(eventId);
    if (!event) return errorHandler(res, 404, "Event not found");

    // Remove existing attendance entry for this user
    event.attendances = event.attendances.filter((att) => att.id !== userId);

    // Add new attendance entry with FCM token
    event.attendances.push({ id: userId, fullName, FCM:token });
    await event.save();

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    next(error);
  }
};

// Send notifications to attendees
export const notify = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title,body } = req.body;
    const userId = req.user.email; // Authenticated user ID

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Authorization check
    if (event.hostedBy !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Extract valid FCM tokens from attendances
    const tokens = event.attendances
      .map((attendance) => attendance.FCM)
      .filter((token) => !!token);

    if (!tokens.length) {
      return res.status(400).json({ error: "No valid FCM tokens found" });
    }

    // Prepare Firebase message
    const message = {
      tokens,
      notification: { title, body },
      webpush: {
        fcmOptions: {
          link: `http://localhost:5173/events/${eventId}`,
        },
      },
    };

    // Send notifications
    const response = await admin.messaging().sendEachForMulticast(message);


    // Log failures
    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        console.error(
          `Failed to send to ${tokens[index]}:`,
          resp.error?.message
        );
      }
    });
   
    

    res.status(200).json({
      successCount: response.successCount,
      failureCount: response.failureCount,
      message: "Notifications processed",
    });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ error: error.message });
  }
};
