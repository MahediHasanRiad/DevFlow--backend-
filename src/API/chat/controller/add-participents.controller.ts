import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { UserService } from "../../user/service/user.service.js";
import { ConversationService } from "../service/chat.service.js";

export const addParticipantsController = asyncHandler(async (req, res) => {
    const conversationId = req.params.conversationId as string;
    if (!conversationId) throw new ApiErrorHandler(400, "Conversation ID is required");
    
    const conversationService = new ConversationService();
    const userService = new UserService()

    const findConversation = await conversationService.getConversation({ conversationId });
    if(!findConversation) throw new ApiErrorHandler(404, "Conversation not found"); 

    if(findConversation.type === "DIRECT") throw new ApiErrorHandler(400, "You can add participent only in Group Chat");

    const participantUserIds = req.body.participantUserIds as string[];

    participantUserIds.forEach(async (participantUserId) => {
        const user = await userService.findUserById(participantUserId);
        if (!user) throw new ApiErrorHandler(404, `User not found ${participantUserId}`);
    })

    const response = await conversationService.addParticipantToConversation({ conversationId, participantUserIds });

    res.status(200).json(new apiResponse(response, "Success"));
})