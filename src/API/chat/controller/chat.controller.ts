import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { CreateChatInputSchema } from "../schema/chat.schema.js";
import { ChatService } from "../service/chat.service.js";

export const createChatController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }

  const { type, title, participantIds } = CreateChatInputSchema.parse(req.body);

  const chatService = new ChatService();

  const conversation = await chatService.createChat({
    type,
    title,
    participantIds,
    createdById: userId,
  });

  res
    .status(201)
    .json(new apiResponse(conversation, "Conversation created successfully"));
});