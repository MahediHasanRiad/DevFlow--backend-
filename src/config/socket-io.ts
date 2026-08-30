import { createServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socket-io.middleware.js";

let io: Server;

export const initSocket = (app: any) => {
  const httpServer = createServer(app);

  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    if (userId) {
      socket.join(userId);
      console.log(`⚡ Socket connected: ${socket.id} | User Room: ${userId}`);
    }

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return httpServer;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io is not initialized!");
  return io;
};