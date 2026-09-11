import { PermissionManager } from "../../../pm/permission-manager.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { SubscriptionService } from "../service/subscription.service.js";


export const deleteSubscriptionController = asyncHandler(async (req, res) => {
    const {subscriptionPlanId} = req.params as {subscriptionPlanId: string}
    if(!subscriptionPlanId) throw new ApiErrorHandler(400, "your subscriptionId not found")

    const orgId = req?.user?.orgId as string
    const orgRole = req?.user?.orgRole as string

    if(!orgId) throw new ApiErrorHandler(400, "your orgId not found")
    if(!orgRole) throw new ApiErrorHandler(400, "your orgRole not found")

    const subscriptionService = new SubscriptionService(orgId)
    const permissionManager = new PermissionManager(orgRole)

    const findUserSubscription = await subscriptionService.findSubscriptionByPlanId(subscriptionPlanId)

    if (!findUserSubscription) {
        throw new ApiErrorHandler(404, "Subscription Plan not found")
    }

    // verification
    if (!permissionManager.hasPermission('subscription:delete')) {
        throw new ApiErrorHandler(403, "You don't have permission to delete subscription")
    }

    // delete
    await subscriptionService.deleteSubscriptionPlan(subscriptionPlanId)

    res.status(204).json(new apiResponse(null, "Subscription Plan deleted successfully"))
    
})