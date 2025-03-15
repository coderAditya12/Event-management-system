import userStore from "@/store/userStore";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const UpdateEvent = () => {
  const { eventId } = useParams();
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    month: "",
    time: "",
    date: "",
    category: "",
    hostedBy: "",
    location: "",
    updateMessage: "", // Added update message field
  });
  const [socket, setSocket] = useState(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const categories = [
    "Tech",
    "Business",
    "Entertainment",
    "Education",
    "Sports",
    "Health",
    "Arts",
    "Social",
    "Other",
  ];
  useEffect(() => {
    if (socket && eventId) {
      socket.emit("joinEventRoom", eventId);
    }
  }, [socket, eventId]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/getevent/${eventId}`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setFormData({
            ...response.data,
            updateMessage: "", // Initialize update message as empty
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/${eventId}/update`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Event updated successfully:", response.data);

        // Emit update notification through socket if there's an update message
        if (socket && formData.updateMessage.trim()) {
          socket.emit("eventUpdated", {
            eventId,
            message: formData.updateMessage,
            updatedBy: user ? user.email : formData.hostedBy,
          });
        }

        navigate(`/event/${eventId}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading event data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Update Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        {/* Month and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="number"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min="1"
              max="31"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Time and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hosted By (Read-Only) */}
        <div>
          <label className="block text-sm font-medium mb-1">Hosted By</label>
          <input
            type="text"
            name="hostedBy"
            value={user ? user.email : formData.hostedBy}
            onChange={handleChange}
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Update Message - New Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Update Message{" "}
            <span className="text-gray-500 text-xs">
              (Optional - Notify attendees about this update)
            </span>
          </label>
          <textarea
            name="updateMessage"
            value={formData.updateMessage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="2"
            placeholder="Describe what's changing in this update..."
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
          >
            {isSubmitting ? "Updating..." : "Update Event"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/events/${eventId}`)}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
