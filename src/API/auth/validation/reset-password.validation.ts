import { z } from "zod";

export const ResetPassSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password is required !!!" }),
    newPassword: z
      .string()
      .min(6, {
        message: "New password must be at least 6 characters long !!!",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required !!!" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match !!!",
    path: ["confirmPassword"],
  });
  

export type ResetPassSchemaType = z.infer<typeof ResetPassSchema>;
