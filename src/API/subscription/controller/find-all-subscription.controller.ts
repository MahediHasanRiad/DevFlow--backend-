import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { SubscriptionService } from "../service/subscription.service.js";

export const findAllSubscriptionController = asyncHandler(async(req,res)=>{
    
    const orgId = req.user?.orgId as string
    if(!orgId) throw new ApiErrorHandler(400,"Organization ID is not found")

    const subscriptionService = new SubscriptionService(orgId)
    const subscriptions = await subscriptionService.findAllSubscriptions()
    
    return res.status(200).json(new apiResponse(subscriptions,"Subscriptions found successfully"))   
})