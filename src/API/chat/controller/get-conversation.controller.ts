import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { UserService } from "../../user/service/user.service.js";
import { ConversationService } from "../service/chat.service.js";

export const getConversationByReceiverIdController = asyncHandler(async (req, res) => {
    const receiverId = req.params.receiverId as string;
    if(!receiverId) throw new ApiErrorHandler(400, "Receiver ID is required");

    const senderId = req.user?.id as string;
    if(!senderId) throw new ApiErrorHandler(401, "Unauthorized");

    const userService = new UserService();
    const conversationService = new ConversationService();

    const getUser = await userService.findUserById(receiverId);
    if(!getUser) throw new ApiErrorHandler(404, "User not found");

    const getConversation = await conversationService.getConversationsByReceiverId({
      senderId,
      receiverId,
    });
    if(!getConversation) throw new ApiErrorHandler(404, "Conversation not found");

    return res.status(200).json(new apiResponse(getConversation, 'Conversations fetched successfully'));
}); 
