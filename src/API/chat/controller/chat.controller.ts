import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import {
  addParticipantSchema,
  CreateChatInputSchema,
  createMessageSchema,
} from "../schema/chat.schema.js";
import { ChatService } from "../service/chat.service.js";

export const createChatController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }

  const { type, title, receiverId } = CreateChatInputSchema.parse(req.body);

  const chatService = new ChatService();

  const conversation = await chatService.createChat({
    type,
    title,
    receiverId,
    createdById: userId,
  });

  res
    .status(201)
    .json(new apiResponse(conversation, "Conversation created successfully"));
});

export const addParticipantController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }

  const { conversationId, userId: participantUserId } =
    addParticipantSchema.parse(req.body);

  const chatService = new ChatService();

  const participant = await chatService.addParticipant({
    conversationId,
    userId: participantUserId,
    requestedById: userId,
  });

  res
    .status(201)
    .json(new apiResponse(participant, "Participant added successfully"));
});

export const createMessageController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }

  const { conversationId, type, message, attachment } =
    createMessageSchema.parse(req.body);

  const chatService = new ChatService();

  const createdMessage = await chatService.createMessage({
    conversationId,
    senderId: userId,
    type,
    message,
    attachment,
  });

  res
    .status(201)
    .json(new apiResponse(createdMessage, "Message sent successfully"));
});