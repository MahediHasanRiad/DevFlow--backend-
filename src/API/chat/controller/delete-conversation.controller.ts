import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { ConversationService } from "../service/chat.service.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";

export const deleteConversationController = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId as string;
  if (!conversationId) throw new ApiErrorHandler(400, "Conversation ID is required");

  const conversationService = new ConversationService();

  await conversationService.deleteConversation({ conversationId });

  res.status(204).json(new apiResponse(null, "Success"));
});