import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Link } from "react-router-dom";
import EventsFilter from "@/components/EventsFilter";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const getEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getallevents"
      );
      if (response.status === 200) {
        setEvents(response.data);
        setFilteredEvents(response.data); // Initialize filtered events
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

  // Handle filtering logic
  useEffect(() => {
    let result = [...events];

    if (selectedStatus !== "all") {
      result = result.filter((event) => event.status === selectedStatus);
    }

    if (selectedMonth !== "all") {
      result = result.filter((event) => event.month === selectedMonth);
    }

    if (selectedCategory !== "all") {
      result = result.filter((event) => event.category === selectedCategory);
    }

    setFilteredEvents(result);
  }, [selectedStatus, selectedMonth, selectedCategory, events]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Events Dashboard</h1>

        <EventsFilter
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link to={`/event/${event._id}`} key={event._id}>
                <Card className="w-full hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Image Section */}
                  <div className="w-full h-48 overflow-hidden">
                    {event.image && event.image.trim() !== "" ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

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
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
// import React, { useEffect, useState } from "react";
// import { Calendar, Clock, MapPin } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const getEvents = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/getallevents"
//       );
//       if (response.status === 200) {
//         setEvents(response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getEvents();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg text-gray-600">Loading events...</p>
//       </div>
//     );
//   }

//   if (events.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg text-gray-600">No events found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">Events Dashboard</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map((event) => (
//           <Link to={`/event/${event._id}`} key={event._id}>
//             <Card
//               key={event._id}
//               className="w-full hover:shadow-lg transition-shadow"
//             >
//               <CardHeader className="space-y-1">
//                 <div className="flex justify-between items-start">
//                   <CardTitle className="text-xl font-bold">
//                     {event.title}
//                   </CardTitle>
//                   <Badge
//                     variant="secondary"
//                     className={`${
//                       event.status === "Upcoming"
//                         ? "bg-green-100 text-green-800"
//                         : event.status === "Completed"
//                         ? "bg-gray-100 text-gray-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {event.status}
//                   </Badge>
//                 </div>
//                 <Badge variant="outline" className="w-fit">
//                   {event.category}
//                 </Badge>
//               </CardHeader>

//               <CardContent className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">
//                     {event.month} {event.date}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Clock className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm">{event.time}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <MapPin className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">
//                     {event.location}
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
