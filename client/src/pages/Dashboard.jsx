import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const getEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getallevents"
      );
      if (response.status === 200) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">No events found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Events Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Link to={`/event/${event._id}`} key={event._id}>
            <Card
              key={event._id}
              className="w-full hover:shadow-lg transition-shadow"
            >
              <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">
                    {event.title}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={`${
                      event.status === "Upcoming"
                        ? "bg-green-100 text-green-800"
                        : event.status === "Completed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                  {event.category}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {event.month} {event.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{event.time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {event.location}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
