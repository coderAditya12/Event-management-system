// config/socketManager.js
import { Server } from "socket.io";
let io;

const connectToSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinEventRoom", (eventId) => {
      socket.join(eventId);

    });
    socket.on("leaveEventRoom", (eventId) => {
      try {
        socket.leave(eventId);
    
      } catch (error) {
        console.error(`Error leaving room ${eventId}:`, error);
      }
    });

    socket.on("disconnect", () => {
     
    });
  });

  return io;
};

export default connectToSocket;
export { io };
