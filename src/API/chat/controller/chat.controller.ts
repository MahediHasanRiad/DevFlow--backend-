import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { conversationSchema } from "../schema/chat.schema.js";
import { ConversationService } from "../service/chat.service.js";

export const createConversationController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }
  const { type, title, receiverId } = createConversationSchema.parse(req.body);

  const conversationService = new ConversationService();
  const existsConversation = await conversationService.existsConversation({ receiverId, createdById: userId });
  if (existsConversation) {
    throw new ApiErrorHandler(400, "Conversation already exists");
  }
  const conversation = await conversationService.createConversation({ type, title, receiverId, createdById: userId });
  return res.status(201).json({ message: "Conversation created successfully", conversation });




});