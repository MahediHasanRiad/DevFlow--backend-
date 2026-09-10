import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type {
  ConversationInputType,
  CreateMessageInputType,
} from "../schema/chat.schema.js";

export class ConversationService {
  
  async existsConversation({
    receiverId,
    createdById,
  }: {
    receiverId: string;
    createdById: string;
  }) {
    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          type: "DIRECT",
          AND: [
            {
              participants: {
                some: { userId: receiverId },
              },
            },
            {
              participants: {
                some: { userId: createdById },
              },
            },
          ],
        },
      });
      return conversation;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to check if conversation exists");
    }
  }

  async createConversation({
    type = "DIRECT",
    title,
    createdById,
    receiverId,
  }: ConversationInputType) {
    try {
      const participants = [
        { userId: createdById },
        ...(receiverId && receiverId !== createdById
          ? [{ userId: receiverId }]
          : []),
      ];

      const conversation = await prisma.conversation.create({
        data: {
          type,
          title,
          createdById,
          participants: {
            create: participants,
          },
        },
      });
      return conversation;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to create conversation");
    }
  }

  async addParticipantToConversation({
    conversationId,
    participantUserIds,
  }: {
    conversationId: string;
    participantUserIds: string[];
  }) {
    try {
      const getConversation = await this.getConversation({ conversationId });
      if (!getConversation) {
        throw new ApiErrorHandler(404, "Conversation not found");
      }

      const createParticipants = participantUserIds.map((userId) => ({
        conversationId,
        userId,
      }));

      const response = await prisma.conversationParticipant.createMany({
        data: createParticipants,
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(
        500,
        "Failed to add participant to conversation",
      );
    }
  }

  async getConversationParticipants({
    conversationId,
  }: {
    conversationId: string;
  }) {
    try {
      const participants = await prisma.conversationParticipant.findMany({
        where: { conversationId },
        select: { userId: true },
      });
      return participants.map(
        (participant: { userId: string }) => participant.userId,
      );
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to get conversation participants");
    }
  }

  async removeParticipantFromConversation({
    conversationId,
    participantUserId,
  }: {
    conversationId: string;
    participantUserId: string;
  }) {
    try {
      const conversation = await prisma.conversationParticipant.delete({
        where: { conversationId, userId: participantUserId },
      });
      return conversation;
    } catch (error) {
      throw new ApiErrorHandler(
        500,
        "Failed to remove participant from conversation",
      );
    }
  }

  async getConversation({ conversationId }: { conversationId: string }) {
    try {
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: true,
        },
      });
      return conversation;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to get conversation");
    }
  }

  async getConversationsByReceiverId({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          AND: [
            {
              participants: {
                some: { userId: senderId },
              },
            },
            {
              participants: {
                some: { userId: receiverId },
              },
            },
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      return conversations;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to get conversations");
    }
  }

  async createMessage({
    conversationId,
    type = "TEXT",
    senderId,
    message,
    attachment,
  }: CreateMessageInputType) {
    try {
      const response = await prisma.message.create({
        data: { conversationId, senderId, message, type, attachment },
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to create message");
    }
  }

  async deleteMessage({ messageId }: { messageId: string }) {
    try {
      const message = await prisma.message.delete({
        where: { id: messageId },
      });
      return message;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to delete message");
    }
  }

  async deleteConversation({ conversationId }: { conversationId: string }) {
    try {
      const conversation = await prisma.conversation.delete({
        where: { id: conversationId },
      });
      return conversation;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error?.code === "P2025"
      ) {
        throw new ApiErrorHandler(404, "Conversation not found");
      } else {
        throw new ApiErrorHandler(500, "Failed to delete conversation");
      }
    }
  }

  async getListOfConversationedUser ({senderId}: {senderId: string}) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId: senderId },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              sender: {
                select: {
                  name: true,
                },
              },
            },
            take: 1
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 1
      });
      return conversations;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to get conversation user list");
    }
  }


}
