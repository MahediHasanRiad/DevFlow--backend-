import { z } from "zod";

export const UpdatePassSchema = z
  .object({
    email: z.email(),
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
  

export type UpdatePassSchemaType = z.infer<typeof UpdatePassSchema>;
