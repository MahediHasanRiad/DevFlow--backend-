import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { updateSubscriptionPlanSchema } from "../schema/subscription.schema.js";
import { SubscriptionService } from "../service/subscription.service.js";

export const updateSubscriptionPlanController = asyncHandler(
  async (req, res) => {
    const subscriptionPlanId = req.params.subscriptionPlanId as string;
    if (!subscriptionPlanId)
      throw new ApiErrorHandler(400, "Subscription plan ID is required");

    const {
      name,
      description,
      type,
      monthlyRegularPrice,
      monthlyDiscountedPrice,
      yearlyRegularPrice,
      yearlyDiscountedPrice,
      features,
    } = updateSubscriptionPlanSchema.parse(req.body);

    const subscriptionService = new SubscriptionService(
      req?.user?.orgId as string,
    );
    const result = await subscriptionService.updateSubscriptionPlan({
      planId: subscriptionPlanId,
      name,
      description,
      type,
      monthlyRegularPrice,
      monthlyDiscountedPrice,
      yearlyRegularPrice,
      yearlyDiscountedPrice,
      features,
    });

    res.status(200).json(new apiResponse(result, "Successfully Updated !!!"));
  },
);
