import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { CloudinaryFileUpload } from "../../../shared/cloudinary.js";
import { createConversationSchema } from "../schema/chat.schema.js";
import { ConversationService } from "../service/chat.service.js";

export const createMessageController = asyncHandler(async (req, res) => {
  
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiErrorHandler(401, "Unauthorized");
  }

  // file upload
  const attachment = req.file?.path as string
  let attachmentURL : string | undefined;
  if(attachment){
    attachmentURL = await CloudinaryFileUpload(attachment)
  }

  const payload = {
    ...req.body,
    attachment: attachmentURL
  }

  const { type, title, receiverId, message } =
    createConversationSchema.parse(payload);
 
  const conversationService = new ConversationService();
  // check conversation already exist or not
  const existsConversation = await conversationService.existsConversation({
    receiverId,
    createdById: userId,
  });

  if (existsConversation) {
    const chatMessage = await conversationService.createMessage({
      conversationId: existsConversation?.id,
      senderId: userId,
      type: message ? 'TEXT' : 'FILE',
      message: message || undefined,
      attachment: attachmentURL || undefined,
    });
    return res
      .status(201)
      .json({ message: "Message created successfully", chatMessage });
  } else {
    // create new conversation and add participant and create initial message
    const { conversation, chatMessage } = await prisma.$transaction(
      async (tx:any) => {
        const newConversation = await tx.conversation.create({
          data: {
            type,
            title: title || undefined,
            createdById: userId,
          },
        });

        const participantData = [
          { conversationId: newConversation.id, userId },
          ...(receiverId
            ? [{ conversationId: newConversation.id, userId: receiverId }]
            : []),
        ];

        await tx.conversationParticipant.createMany({
          data: participantData,
          skipDuplicates: true,
        });

        let initialMessage = null;
        if (message || attachment) {
          initialMessage = await tx.message.create({
            data: {
              conversationId: newConversation.id,
              senderId: userId,
              type: message ? 'TEXT' : 'FILE',
              message: message || null,
              attachment: attachmentURL || null,
            },
          });
        }

        return {
          conversation: newConversation,
          chatMessage: initialMessage,
        };
      },
    );
    return res
      .status(201)
      .json({ message: "Message created successfully", chatMessage });
  }
});
