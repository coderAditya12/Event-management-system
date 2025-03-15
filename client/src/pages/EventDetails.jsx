import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import userStore from "@/store/userStore";
import { io } from "socket.io-client";
import { getToken, messaging, onMessage } from "@/firebase";

const EventDetailPage = () => {
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);
  const [isAttending, setIsAttending] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [notificationSubscribed, setNotificationSubscribed] = useState(false);

  // Set up FCM listener only once
  useEffect(() => {
    console.log("Setting up FCM listener");
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);
      // Show notification manually
      const { title, body } = payload.notification;
      if (title && body) {
        new Notification(title, { body });
      }
    });

    // Cleanup listener on unmount
    return () => {
      console.log("Cleaning up FCM listener");
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this only runs once

  const getEvent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/getEvent/${eventId}`
      );
      setEvent(response.data);
      if (user) {
        setIsHost(user.email === response.data.hostedBy);
        const userAttending = response.data.attendances.some(
          (attendee) => attendee.id === user._id
        );
        setIsAttending(userAttending);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Set up socket connection once
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join event room when socket is ready
  useEffect(() => {
    if (socket && eventId) {
      socket.emit("joinEventRoom", eventId);
    }
  }, [socket, eventId]);

  // Listen for attendance updates from the server
  useEffect(() => {
    if (socket) {
      socket.on("eventUpdated", (updateEvent) => {
        setEvent(updateEvent);
      });
      socket.on("attendanceUpdated", (updatedAttendances) => {
        setEvent((prev) => ({ ...prev, attendances: updatedAttendances }));
        if (user) {
          const userAttending = updatedAttendances.some(
            (attendee) => attendee.id === user._id
          );
          setIsAttending(userAttending);
        }
      });
    }
    
    // Clean up socket listeners
    return () => {
      if (socket) {
        socket.off("eventUpdated");
        socket.off("attendanceUpdated");
      }
    };
  }, [socket, user]);

  const requestNotificationPermission = async (eventId) => {
    if (notificationSubscribed) {
      console.log("Already subscribed to notifications");
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey:
            "BGZ82SLKBqhgaUDPj0-y_D1gWRSu34Lz_bpfWEd3Xj-8-s0_WTeho3nQvt8h2Od4Qb9t33Eert5vaMWkMkM7o2M",
          registration,
        });
        console.log("FCM token:", token);
        const response = await axios.post(
          `http://localhost:3000/api/${eventId}/subscribe`,
          {
            userId: user._id,
            token,
            fullName: user.fullName,
          },
          { withCredentials: true }
        );
        if (response.status === 200) {
          console.log("Notification subscription successful:", response.data);
          setNotificationSubscribed(true);
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  // Subscribe to notifications once when user and event are available
  useEffect(() => {
    if (user && event && isAttending && !notificationSubscribed) {
      requestNotificationPermission(eventId);
    }
  }, [user, event, isAttending, notificationSubscribed, eventId]);

  // Initial event fetch
  useEffect(() => {
    if (eventId) {
      getEvent();
    }
  }, [eventId]); // Only refetch when eventId changes, not user

  // Check attendance status when user changes
  useEffect(() => {
    if (event && user) {
      setIsHost(user.email === event.hostedBy);
      const userAttending = event.attendances.some(
        (attendee) => attendee.id === user._id
      );
      setIsAttending(userAttending);
    }
  }, [user, event]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/${eventId}/join`,
        { userId: user._id, fullName: user.fullName },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsAttending(true);
        // Notification subscription will be handled by the useEffect
      }
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const handleLeave = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/${eventId}/leave`,
        {
          data: { userId: user._id },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setIsAttending(false);
        setNotificationSubscribed(false); // Reset notification subscription state
      }
    } catch (error) {
      console.error("Error leaving event:", error);
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
              {isHost && (
                <div className="space-y-2">
                  <h4 className="font-medium">Participants:</h4>
                  {event.attendances?.map((attendee) => (
                    <div
                      key={attendee.id || Math.random()}
                      className="flex items-center gap-2"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span>{attendee.fullName}</span>
                    </div>
                  ))}
                  <Button asChild>
                    <Link to={`/${eventId}/update`}>Update event</Link>
                  </Button>
                </div>
              )}

              {!isHost &&
                (isAttending ? (
                  <Button
                    onClick={handleLeave}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700"
                  >
                    Leave Event
                  </Button>
                ) : (
                  <Button onClick={handleRegister} className="w-full mt-4">
                    Register for Event
                  </Button>
                ))}
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


// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar, Clock, MapPin, User, Users } from "lucide-react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import userStore from "@/store/userStore";
// import { io } from "socket.io-client";
// import { getToken, messaging, onMessage } from "@/firebase";

// const EventDetailPage = () => {
//   const user = userStore((state) => state.user);
//   const navigate = useNavigate();
//   const { eventId } = useParams();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [socket, setSocket] = useState(null);
//   const [error, setError] = useState(null);
//   const [isAttending, setIsAttending] = useState(false);
//   const [isHost, setIsHost] = useState(false);
//   // Add the onMessage listener
//   useEffect(() => {
//     console.log("useEffect");
//     const unsubscribe = onMessage(messaging, (payload) => {
//       console.log("Foreground message received:", payload);
//       // Show notification manually
//       const { title, body } = payload.notification;
//       if (title && body) {
//         new Notification(title, { body });
//       }
//     });

//     // Cleanup listener on unmount
//     return () => unsubscribe();
//   }, []);

//   const getEvent = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `http://localhost:3000/api/getEvent/${eventId}`
//       );
//       setEvent(response.data);
//       if (user) {
//         setIsHost(user.email === response.data.hostedBy);
//         const userAttending = response.data.attendances.some(
//           (attendee) => attendee.id === user._id
//         );
//         setIsAttending(userAttending);
//       }

//       setError(null);
//     } catch (error) {
//       console.error("Error fetching event:", error);
//       setError("Failed to load event details. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const newSocket = io("http://localhost:3000");
//     setSocket(newSocket);
//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   //join event room when socket is ready
//   useEffect(() => {
//     if (socket && eventId) {
//       socket.emit("joinEventRoom", eventId);
//     }
//   }, [socket, eventId]);

//   //listen for attendance updates from the server
//   useEffect(() => {
//     if (socket) {
//       socket.on("eventUpdated", (updateEvent) => {
//         setEvent(updateEvent);
//       });
//       socket.on("attendanceUpdated", (updatedAttendances) => {
//         setEvent((prev) => ({ ...prev, attendances: updatedAttendances }));
//         if (user) {
//           const userAttending = updatedAttendances.some(
//             (attendee) => attendee.id === user._id
//           );
//           setIsAttending(userAttending);
//         }
//       });
//     }
//   }, [socket, user]);
//   const requestNotificationPermission = async (eventId) => {
//     try {
//       const permission = await Notification.requestPermission();
//       const registration = await navigator.serviceWorker.register(
//         "/firebase-messaging-sw.js"
//       );
//       if (permission === "granted") {
//         const token = await getToken(messaging, {
//           vapidKey:
//             "BGZ82SLKBqhgaUDPj0-y_D1gWRSu34Lz_bpfWEd3Xj-8-s0_WTeho3nQvt8h2Od4Qb9t33Eert5vaMWkMkM7o2M",
//           registration,
//         });
//         console.log(token);
//         const response = await axios.post(
//           `http://localhost:3000/api/${eventId}/subscribe`,
//           {
//             userId: user._id,
//             token,
//             fullName: user.fullName,
//           },
//           { withCredentials: true }
//         );
//         if (response.status === 200) {
//           console.log(response.data);
//         }

//         //api call
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // useEffect(() => {
//   //   if (user && event) {
//   //     requestNotificationPermission(eventId);
//   //   }
//   // }, [user, event]);

//   useEffect(() => {
//     if (eventId) {
//       getEvent();
//     }
//   }, [eventId, user]); // Add user as dependency to re-check attendance status if user changes

//   const handleRegister = async () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/${eventId}/join`,
//         { userId: user._id, fullName: user.fullName },
//         { withCredentials: true }
//       );
//       if (response.status === 200) {
//         setIsAttending(true);
//         requestNotificationPermission(eventId);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleLeave = async () => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const response = await axios.delete(
//         `http://localhost:3000/api/${eventId}/leave`,
//         {
//           data: { userId: user._id },
//           withCredentials: true,
//         }
//       );
//       if (response.status === 200) {
//         setIsAttending(false);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Show loading state while fetching data
//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
//         <p>Loading event details...</p>
//       </div>
//     );
//   }

//   // Show error state if there was a problem
//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <Card>
//           <CardContent className="p-6">
//             <div className="text-red-500">{error}</div>
//             <Button onClick={getEvent} className="mt-4">
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Show message if no event was found
//   if (!event) {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <Card>
//           <CardContent className="p-6">
//             <div>Event not found</div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Only render the event details if event exists
//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">{event.title}</CardTitle>
//           <div className="flex items-center text-gray-500 text-sm">
//             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//               {event.category}
//             </span>
//             <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
//               {event.status}
//             </span>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Event Image */}
//           {event.image ? (
//             <img
//               src={event.image}
//               alt={event.title}
//               className="w-full h-64 object-cover rounded-md"
//             />
//           ) : (
//             <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
//               <span className="text-gray-400">No image available</span>
//             </div>
//           )}

//           {/* Event Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">About the Event</h3>
//               <p>{event.description}</p>

//               <div className="flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-gray-500" />
//                 <span>
//                   {event.month} {event.date}, 2025
//                 </span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Clock className="w-5 h-5 text-gray-500" />
//                 <span>{event.time}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <MapPin className="w-5 h-5 text-gray-500" />
//                 <span>{event.location}</span>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-lg font-medium">Attendance</h3>
//               <div className="flex items-center gap-2">
//                 <User className="w-5 h-5 text-gray-500" />
//                 <span>Hosted by: {event.hostedBy}</span>
//               </div>

//               <div className="flex items-center gap-2">
//                 <Users className="w-5 h-5 text-gray-500" />
//                 <span>
//                   {event.attendances ? event.attendances.length : 0} attending
//                 </span>
//               </div>
//               {isHost && (
//                 <div className="space-y-2">
//                   <h4 className="font-medium">Participants:</h4>
//                   {event.attendances?.map((attendee) => (
//                     <div
//                       key={Math.random()}
//                       className="flex items-center gap-2"
//                     >
//                       <User className="w-5 h-5 text-gray-500" />
//                       <span>{attendee.fullName}</span>
//                     </div>
//                   ))}
//                   <Button asChild>
//                     <Link to={`/${eventId}/update`}>Update event</Link>
//                   </Button>
//                 </div>
//               )}

//               {!isHost &&
//                 (isAttending ? (
//                   <Button
//                     onClick={handleLeave}
//                     className="w-full mt-4 bg-red-600 hover:bg-red-700"
//                   >
//                     Leave Event
//                   </Button>
//                 ) : (
//                   <Button onClick={handleRegister} className="w-full mt-4">
//                     Register for Event
//                   </Button>
//                 ))}
//             </div>
//           </div>

//           {/* Event Details */}
//           <div>
//             <h3 className="text-lg font-medium mb-2">Event Details</h3>
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div>
//                 <span className="font-medium">Created:</span>{" "}
//                 {new Date(event.createdAt).toLocaleDateString()}
//               </div>
//               <div>
//                 <span className="font-medium">Last Updated:</span>{" "}
//                 {new Date(event.updatedAt).toLocaleDateString()}
//               </div>
//               <div>
//                 <span className="font-medium">Event ID:</span> {event._id}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default EventDetailPage;
