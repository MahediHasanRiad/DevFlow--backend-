import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";


interface CreateChatParams extends CreateChatInput {
  createdById: string;
}

interface AddParticipantParams extends AddParticipantInput {
  requestedById: string;
}

interface CreateMessageParams extends CreateMessageInput {
  senderId: string;
}

export class ChatService {
  
  async createConversation({ type, title, receiverId, createdById }: CreateChatParams) {
    try {
      if (createdById === receiverId) {
        throw new ApiErrorHandler(
          400,
          "Cannot create a conversation with yourself",
        );
      }

      const receiver = await prisma.user.findFirst({
        where: { id: receiverId },
      });

      if (!receiver) {
        throw new ApiErrorHandler(404, "Receiver not found");
      }

      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type,
          AND: [
            { participants: { some: { userId: createdById } } },
            { participants: { some: { userId: receiverId } } },
            {
              participants: {
                none: { userId: { notIn: [createdById, receiverId] } },
              },
            },
          ],
        },
        include: {
          participants: true,
        },
      });

      if (existingConversation) {
        return existingConversation;
      }

      const conversation = await prisma.conversation.create({
        data: {
          type,
          title: type === "GROUP" ? title : null,
          createdById,
          participants: {
            create: [{ userId: createdById }, { userId: receiverId }],
          },
        },
        include: {
          participants: true,
        },
      });

      return conversation;
    } catch (error) {
      if (error instanceof ApiErrorHandler) {
        throw error;
      }
      console.error("ChatService createChat error:", error);
      throw new ApiErrorHandler(
        500,
        error instanceof Error
          ? error.message
          : "Failed to create conversation",
      );
    }
  }

  async addParticipant({
    conversationId,
    userId,
    requestedById,
  }: AddParticipantParams) {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId },
        include: { participants: true },
      });

      if (!conversation) {
        throw new ApiErrorHandler(404, "Conversation not found");
      }

      if (conversation.type === "DIRECT") {
        throw new ApiErrorHandler(
          400,
          "Cannot add participants to a direct conversation",
        );
      }

      const participantUserIds = conversation.participants.map(
        (participant: { userId: string }) => participant.userId,
      );

      if (!participantUserIds.includes(requestedById)) {
        throw new ApiErrorHandler(
          403,
          "You are not a participant of this conversation",
        );
      }

      if (participantUserIds.includes(userId)) {
        throw new ApiErrorHandler(409, "User is already a participant");
      }

      const user = await prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        throw new ApiErrorHandler(404, "User not found");
      }

      const participant = await prisma.conversationParticipant.create({
        data: {
          conversationId,
          userId,
        },
      });

      return participant;
    } catch (error) {
      if (error instanceof ApiErrorHandler) {
        throw error;
      }
      console.error("ChatService addParticipant error:", error);
      throw new ApiErrorHandler(
        500,
        error instanceof Error
          ? error.message
          : "Failed to add conversation participant",
      );
    }
  }

  async createMessage({
    conversationId,
    senderId,
    type,
    message,
    attachment,
  }: CreateMessageParams) {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId },
        include: { participants: true },
      });

      if (!conversation) {
        throw new ApiErrorHandler(404, "Conversation not found");
      }

      const senderIsParticipant = conversation.participants.some(
        (participant: { userId: string }) => participant.userId === senderId,
      );

      if (!senderIsParticipant) {
        throw new ApiErrorHandler(
          403,
          "You are not a participant of this conversation",
        );
      }

      const createdMessage = await prisma.message.create({
        data: {
          conversationId,
          senderId,
          type: type ?? "TEXT",
          message,
          attachment,
        },
      });

      return createdMessage;
    } catch (error) {
      if (error instanceof ApiErrorHandler) {
        throw error;
      }
      console.error("ChatService createMessage error:", error);
      throw new ApiErrorHandler(
        500,
        error instanceof Error ? error.message : "Failed to create message",
      );
    }
  }
}
