import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ConversationService } from "../service/chat.service.js";


export const getConversationUserListController = asyncHandler(
  async (req, res) => {
    const senderId = req.user?.id as string;
    if (!senderId) throw new ApiErrorHandler(401, "Unauthorized");

    const conversationService = new ConversationService();

    const getConversationUserList =
      await conversationService.getListOfConversationedUser({ senderId });


    res.status(200).json(new apiResponse(200, getConversationUserList))
  },
);
