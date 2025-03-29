import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import userStore from "@/store/userStore";
import { Link, useNavigate } from "react-router-dom";

const UserProfilePage = () => {
  // State management
  const [eventData, setEventData] = useState({
    hostedEvents: [],
    attendedEvents: [],
    historyEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Hosted");

  // Get user from store and initialize navigation
  const { user } = userStore();
  const navigate = useNavigate();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/dashboard", {
          withCredentials: true,
        });
        setEventData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch events");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Delete event handler
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/${eventId}/${user._id}/delete`, {
        withCredentials: true,
      });
      // Remove the deleted event from the local state
      setEventData((prevData) => ({
        ...prevData,
        hostedEvents: prevData.hostedEvents.filter(
          (event) => event._id !== eventId
        ),
      }));
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  // Handler to navigate to update profile page
  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  // Determine events to display based on active filter
  const getFilteredEvents = () => {
    switch (activeFilter) {
      case "Hosted":
        return eventData.hostedEvents;
      case "Attended":
        return eventData.attendedEvents;
      case "History":
        return eventData.historyEvents;
      default:
        return eventData.hostedEvents;
    }
  };

  const filteredEvents = getFilteredEvents();

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* User Details Section */}
        <Card className="mb-6 bg-purple-50">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 px-4 py-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <img
                src={user.image}
                alt={user.fullName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-500"
              />
              <div>
                <CardTitle className="text-xl sm:text-2xl text-purple-800">
                  {user.fullName}
                </CardTitle>
                <p className="text-purple-600 text-sm sm:text-base">
                  {user.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleUpdateProfile}
              className="bg-purple-500 text-white hover:bg-purple-600 w-full sm:w-auto"
            >
              Update Profile
            </Button>
          </CardHeader>
        </Card>

        {/* Events Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-800">My Events</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {/* Event Filters */}
            <Tabs
              defaultValue="Hosted"
              onValueChange={setActiveFilter}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-purple-100 mb-4">
                {["Hosted", "Attended", "History"].map((filter) => (
                  <TabsTrigger
                    key={filter}
                    value={filter}
                    className="data-[state=active]:bg-purple-500 data-[state=active]:text-white text-xs sm:text-sm"
                  >
                    {filter}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Event List */}
              {filteredEvents.length === 0 ? (
                <p className="text-center text-gray-500">No events found</p>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div
                      key={event._id}
                      className="border rounded-lg p-3 sm:p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-40 sm:w-24 sm:h-24 object-cover rounded-lg"
                        />
                        <div className="flex-grow w-full">
                          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start space-y-2 sm:space-y-0">
                            <div className="text-center sm:text-left w-full">
                              <h3 className="text-lg font-semibold text-purple-800">
                                {event.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {event.month} {event.date} | {event.time} |{" "}
                                {event.location}
                              </p>
                              <Badge
                                variant="outline"
                                className="mt-2 bg-purple-50 text-purple-800 border-purple-300"
                              >
                                {event.category}
                              </Badge>
                            </div>
                            {activeFilter === "Hosted" && (
                              <div className="flex space-x-2 mt-3 sm:mt-0">
                                <Button
                                  variant="outline"
                                  className="border-purple-500 text-purple-500 hover:bg-purple-50 text-xs sm:text-sm"
                                  asChild
                                >
                                  <Link to={`/${event._id}/update`}>Edit</Link>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      className="bg-red-500 hover:bg-red-600 text-xs sm:text-sm"
                                    >
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="max-w-xs sm:max-w-md">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the event.
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteEvent(event._id)
                                        }
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </div>
                          {activeFilter === "Hosted" &&
                            event.attendances.length > 0 && (
                              <div className="mt-2 text-center sm:text-left">
                                <p className="text-xs sm:text-sm text-gray-600">
                                  Attendees:{" "}
                                  {event.attendances
                                    .map((att) => att.fullName)
                                    .join(", ")}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
