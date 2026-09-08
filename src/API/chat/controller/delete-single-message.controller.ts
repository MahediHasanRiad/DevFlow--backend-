import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { ConversationService } from "../service/chat.service.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";

export const deleteSingleMessageController = asyncHandler(async (req, res) => {
  const messageId = req.params.messageId as string;
  if (!messageId) throw new ApiErrorHandler(400, "Message ID is required");

  const conversationService = new ConversationService();

  await conversationService.deleteMessage({ messageId });

  res.status(204).json(new apiResponse(null, "Success"));
});
