import { z } from "zod";

// --- Enums ---
export const ConversationTypeEnum = z.enum(["DIRECT", "GROUP"]); 
export const MessageTypeEnum = z.enum(["TEXT", "IMAGE", "FILE"]);

// --- Base Model Schemas ---
export const conversationSchema = z.object({
  id: z.string().uuid("Invalid Conversation ID").optional(),
  type: ConversationTypeEnum,
  title: z.string().trim().min(1, "Title cannot be empty").nullable().optional(),
  createdById: z.string().uuid("Invalid Creator User ID"),
});

export const conversationParticipantSchema = z.object({
  id: z.string().uuid("Invalid Participant ID"),
  conversationId: z.string().uuid("Invalid Conversation ID"),
  userId: z.string().uuid("Invalid User ID"),
  joinedAt: z.date().default(() => new Date()),
});

export const messageSchema = z
  .object({
    conversationId: z.string().uuid("Invalid Conversation ID"),
    senderId: z.string().uuid("Invalid Sender User ID"),
    type: MessageTypeEnum.default("TEXT"),
    message: z.string().trim().nullable().optional(),
    attachment: z.string().url("Attachment must be a valid URL").nullable().optional(),
  })
  .refine((data) => data.message || data.attachment, {
    message: "Either a text message or an attachment must be provided",
    path: ["message"],
  });



// Payload for adding a participant to a conversation
export const addParticipantSchema = z.object({
  conversationId: z.string().uuid("Invalid Conversation ID"),
  userId: z.string().uuid("Invalid User ID"),
});

// Payload for sending a message
export const createMessageSchema = z
  .object({
    conversationId: z.string().uuid("Invalid Conversation ID"),
    type: MessageTypeEnum.default("TEXT"),
    message: z.string().trim().min(1, "Message content cannot be empty").optional(),
    attachment: z.string().url("Invalid attachment URL").optional(),
  })
  .refine((data) => data.message || data.attachment, {
    message: "A message must contain either text content or an attachment",
    path: ["message"],
  });



export type ConversationInputType = z.infer<typeof conversationSchema>;
export type ConversationParticipantInputType = z.infer<typeof conversationParticipantSchema>;
export type MessageInputType = z.infer<typeof messageSchema>;
export type CreateMessageInputType = z.infer<typeof createMessageSchema>;