import { z } from "zod";

export const rawSubscriptionPlanSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  type: z.enum(["FREE", "PREMIUM", "ENTERPRISE"]).default("FREE"),

  monthlyRegularPrice: z.number().min(0).multipleOf(0.01),
  monthlyDiscountedPrice: z.number().min(0).multipleOf(0.01),

  yearlyRegularPrice: z.number().min(0).multipleOf(0.01),
  yearlyDiscountedPrice: z.number().min(0).multipleOf(0.01),

  features: z.array(z.string().min(1)).min(1),
});

// Create schema with cross-field validation
export const subscriptionPlanSchema = rawSubscriptionPlanSchema
  .refine((data) => data.monthlyRegularPrice >= data.monthlyDiscountedPrice, {
    message:
      "Monthly regular price cannot be less than monthly discounted price",
    path: ["monthlyDiscountedPrice"],
  })
  .refine((data) => data.yearlyRegularPrice >= data.yearlyDiscountedPrice, {
    message:
      "Yearly regular price cannot be less than yearly discounted price",
    path: ["yearlyDiscountedPrice"],
  });

// Update schema: partial base schema
export const updateSubscriptionPlanSchema =
  rawSubscriptionPlanSchema.partial();

export type SubscriptionPlanInput = z.infer<typeof subscriptionPlanSchema>;
export type UpdateSubscriptionInput = z.infer<
  typeof updateSubscriptionPlanSchema
>;