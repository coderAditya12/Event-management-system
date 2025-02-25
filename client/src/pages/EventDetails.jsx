import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDetailPage = () => {
  const { eventId } = useParams(); // Make sure this matches your route parameter name
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/getEvent/${eventId}`
      );
      setEvent(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      getEvent();
    }
  }, [eventId]); // Add eventId as dependency

  const handleRegister = () => {
    if (event) {
      console.log("Registering for event:", event._id);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
        <p>Loading event details...</p>
      </div>
    );
  }

  // Show error state if there was a problem
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-red-500">{error}</div>
            <Button onClick={getEvent} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if no event was found
  if (!event) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div>Event not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only render the event details if event exists
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <div className="flex items-center text-gray-500 text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {event.category}
            </span>
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {event.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Event Image */}
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">About the Event</h3>
              <p>{event.description}</p>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>
                  {event.month} {event.date}, 2025
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Attendance</h3>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span>Hosted by: {event.hostedBy}</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-500" />
                <span>
                  {event.attendances ? event.attendances.length : 0} attending
                </span>
              </div>

              <Button onClick={handleRegister} className="w-full mt-4">
                Register for Event
              </Button>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h3 className="text-lg font-medium mb-2">Event Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Created:</span>{" "}
                {new Date(event.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(event.updatedAt).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Event ID:</span> {event._id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetailPage;
