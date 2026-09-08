import { Router } from "express";
import { createMessageController } from "../controller/chat.controller.js";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { upload } from "../../../middleware/multer.middleware.js";
import { getConversationByReceiverIdController } from "../controller/get-conversation.controller.js";
import { getConversationUserListController } from "../controller/get-conversation-user-list.controller.js";
import { deleteSingleMessageController } from "../controller/delete-single-message.controller.js";
import { deleteConversationController } from "../controller/delete-conversation.controller.js";
import { addParticipantsController } from "../controller/add-participents.controller.js";


const conversationRouter = Router();

conversationRouter.post("/create", authVerify, upload.single("attachment"), createMessageController);
conversationRouter.get('/get-all-conversations/:receiverId', authVerify, getConversationByReceiverIdController);
conversationRouter.get('/get-conversations-user-lists', authVerify, getConversationUserListController)
conversationRouter.delete('/delete-message/:messageId', authVerify, deleteSingleMessageController)
conversationRouter.delete('/delete-conversation/:conversationId', authVerify, deleteConversationController)
conversationRouter.patch('/add-participant/:conversationId', authVerify, addParticipantsController)

export { conversationRouter };
