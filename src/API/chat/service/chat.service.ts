import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type {
  ConversationInputType,
  MessageInputType,
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
          AND: [
            {
              participants: {
                some: { userId: receiverId },
              },
            },
            { createdById },
            { type: "DIRECT" },
          ],
        },
      });
      return conversation;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to check if conversation exists");
    }
  }
  
  async createConversation({
    type,
    title,
    createdById,
  }: ConversationInputType) {
    try {
      const conversation = await prisma.conversation.create({
        data: {
          type,
          title,
          createdById,
        },
      });
      return conversation;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to create conversation");
    }
  }

  async addParticipantToConversation({
    conversationId,
    participantUserId,
  }: {
    conversationId: string;
    participantUserId: string;
  }) {
    try {

      const getConversation = await this.getConversation({ conversationId });
      if (!getConversation) {
        throw new ApiErrorHandler(404, "Conversation not found");
      }
      if(getConversation.type === "DIRECT") {
        throw new ApiErrorHandler(400, "Only group conversations can add participants");
      }

      const response = await prisma.conversationParticipant.create({
        data: {
          conversationId,
          userId: participantUserId,
        },
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(
        500,
        "Failed to add participant to conversation",
      );
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

  async getConversation({
    conversationId,
  }: {
    conversationId: string;
  }) {
    try {
      const conversation = await prisma.conversation.findMany({
        where: { id: conversationId },
        include: {
          participants: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return conversation;
    }catch (error) {
      throw new ApiErrorHandler(500, "Failed to get conversation");
    }
  }

  async createMessage({
    conversationId,
    senderId,
    type = "TEXT",
    message,
    attachment,
  }: MessageInputType) {
    try {
      const response = await prisma.message.create({
        data: { conversationId, senderId, message, type, attachment },
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to create message");
    }
  } 

  async deleteMessage({
    messageId,
  }: {
    messageId: string;
  }) {
    try {
      const message = await prisma.message.delete({
        where: { id: messageId },
      });
      return message;
    } catch (error) {
      throw new ApiErrorHandler(500, "Failed to delete message");
    }
  }

  async deleteConversation({
    conversationId,
  }: {
    conversationId: string;
  }) {
    try {
      const conversation = await prisma.conversation.delete({
        where: { id: conversationId },
      });
    return conversation;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error?.code === "P2025") {
        throw new ApiErrorHandler(404, "Conversation not found");
      } else {
        throw new ApiErrorHandler(500, "Failed to delete conversation");
      }
    }
  }
  
}
