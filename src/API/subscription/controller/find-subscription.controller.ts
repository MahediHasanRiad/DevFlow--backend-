import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { SubscriptionService } from "../service/subscription.service.js";

export const findSingleSubscription = asyncHandler(async (req, res) => {
  const orgId = req.user?.orgId as string;
  const subscriptionId = req.params.subscriptionId as string;
  if (!orgId) throw new ApiErrorHandler(400, "Organization ID is not authorized");
  if (!subscriptionId) throw new ApiErrorHandler(400, "Subscription ID is not found");

  const subscriptionService = new SubscriptionService(orgId);
  const subscription = await subscriptionService.findSingleSubscription(subscriptionId);
  if (!subscription) throw new ApiErrorHandler(404, "Subscription not found");

  return res
    .status(200)
    .json(new apiResponse(subscription, "Subscription found successfully"));
});