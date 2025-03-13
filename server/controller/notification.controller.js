import Event from "../model/event.model.js";
import errorHandler from "../middleware/error.js";
import admin from "../firebase-admin.js";

export const subscribe = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { userId, token } = req.body;
    console.log("notification subscribe",token);
    const event = await Event.findById(eventId);
    if (!event) {
      return errorHandler(res, 404, "Event not found");
    }
    event.subsribes = event.subsribes.filter((sub) => sub.userId !== userId);
    event.subsribes.push({ userId, fcmToken: token });
    await event.save();
    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    next(error);
  }
};
export const notify = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, body } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.hostedBy !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const tokens = event.subsribes
      .map(sub => sub.fcmToken)
      .filter(token => !!token); // Remove empty/null tokens

    if (!tokens.length) {
      return res.status(400).json({ error: 'No valid subscribers found' });
    }

    const message = {
      tokens,
      notification: { title, body },
      webpush: {
        fcmOptions: {
          link: `http://localhost:5173/events/${eventId}`
        }
      }
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    // Error analysis
    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        console.error(`Failed to send to ${tokens[index]}:`, resp.error?.message);
      }
    });

    res.status(200).json({
      successCount: response.successCount,
      failureCount: response.failureCount,
      message: "Notifications processed"
    });

  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: error.message });
  }
}