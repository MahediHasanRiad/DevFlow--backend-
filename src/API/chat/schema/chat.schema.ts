import { z } from "zod";

export const CreateChatInputSchema = z.object({
  type: z.enum(["DIRECT", "GROUP"]).default("DIRECT"),
  title: z
    .string()
    .trim()
    .max(100, "Title cannot exceed 100 characters")
    .optional()
    .nullable(),
  participantIds: z
    .array(z.string().min(1, "Participant ID cannot be empty"))
    .min(1, "At least one participant is required"),
});

export type CreateChatInput = z.infer<typeof CreateChatInputSchema>;
