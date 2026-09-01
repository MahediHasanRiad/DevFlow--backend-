import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { CreateChatInput } from "../schema/chat.schema.js";

interface CreateChatParams extends CreateChatInput {
  createdById: string;
}

export class ChatService {
  async createChat({
    type = "DIRECT",
    title,
    participantIds,
    createdById,
  }: CreateChatParams) {
    try {
     
    } catch (error) {
      if (error instanceof ApiErrorHandler) {
        throw error;
      }
      console.error("ChatService createChat error:", error);
      throw new ApiErrorHandler(
        500,
        error instanceof Error ? error.message : "Failed to create conversation",
      );
    }
  }
}
