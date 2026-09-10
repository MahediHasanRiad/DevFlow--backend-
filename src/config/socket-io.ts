import { createServer } from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "../middleware/socket-io.middleware.js";
import { prisma } from "../lib/prisma.js";

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

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    if (userId) {
      // Join user's personal notification room
      socket.join(userId);
      console.log(`Socket connected: ${socket.id} | User Room: ${userId}`);

      // Auto-join all group/conversation rooms the user belongs to
      try {
        const userConversations = await prisma.conversationParticipant.findMany({
          where: { userId },
          select: { conversationId: true },
        });

        userConversations.forEach(({ conversationId }: { conversationId: string }) => {
          socket.join(conversationId);
        });
      } catch (err) {
        console.error("Failed to auto-join conversation rooms:", err);
      }
    }

    // Explicitly join a group room
    socket.on(
      "join_group",
      async (
        data: { conversationId: string },
        callback?: (response: { success: boolean; message?: string; error?: string }) => void
      ) => {
        try {
          const { conversationId } = data;

          if (!conversationId) {
            return callback?.({ success: false, error: "conversationId is required" });
          }

          if (!userId) {
            return callback?.({ success: false, error: "User is not authenticated" });
          }

          // Verify if user is a participant of this conversation
          const isParticipant = await prisma.conversationParticipant.findUnique({
            where: {
              conversationId_userId: {
                conversationId,
                userId,
              },
            },
          });

          if (!isParticipant) {
            return callback?.({
              success: false,
              error: "Unauthorized: You are not a participant in this conversation",
            });
          }

          socket.join(conversationId);
          console.log(`👥 User ${userId} joined Room: ${conversationId}`);

          // Notify other participants in the room
          socket.to(conversationId).emit("user_joined_group", {
            userId,
            conversationId,
          });

          callback?.({ success: true, message: `Joined room ${conversationId}` });
        } catch (error) {
          console.error("Error joining group room:", error);
          callback?.({ success: false, error: "Failed to join group" });
        }
      }
    );

    // Leave a group room
    socket.on("leave_group", (data: { conversationId: string }) => {
      const { conversationId } = data;
      if (conversationId) {
        socket.leave(conversationId);
        console.log(`👋 User ${userId} left Room: ${conversationId}`);

        socket.to(conversationId).emit("user_left_group", {
          userId,
          conversationId,
        });
      }
    });

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
