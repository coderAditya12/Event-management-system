// components/SendNotification.js
import { useState } from "react";
import axios from "axios";

const SendNotification = ({ eventId }) => {
  const [message, setMessage] = useState("");

  const handleSendNotification = async () => {
    try {
      await axios.post(`/api/events/${eventId}/notify`, {
        title: "Event Update",
        body: message
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Send Notification to Attendees</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Enter notification message..."
      />
      <Button onClick={handleSendNotification}>
        Send Notification
      </Button>
    </div>
  );
};