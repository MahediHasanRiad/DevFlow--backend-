import { PermissionManager } from "../../../pm/permission-manager.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { subscriptionPlanSchema } from "../schema/subscription.schema.js";
import { SubscriptionService } from "../service/subscription.service.js";

export const createSubscriptionController = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    type,
    monthlyRegularPrice,
    monthlyDiscountedPrice,
    yearlyRegularPrice,
    yearlyDiscountedPrice,
    features,
  } = subscriptionPlanSchema.parse(req.body);

  const orgId = req.user?.orgId as string
  if(!orgId) throw new ApiErrorHandler(400, "Organization ID is required");

  const subscriptionService = new SubscriptionService(orgId);
  const permissionManager = new PermissionManager(req.user?.orgRole!)

  // verify permission
  const hasPermission = await permissionManager.hasPermission("SUBSCRIPTION:ADD");
  if(!hasPermission) throw new ApiErrorHandler(403, "Unauthorized to create subscription !");

  const response = await subscriptionService.createSubscription({
    name,
    description,
    type,
    monthlyRegularPrice,
    monthlyDiscountedPrice,
    yearlyRegularPrice,
    yearlyDiscountedPrice,
    features,
  });

  return res.status(201).json(new apiResponse(response, "Subscription created successfully"));
});
