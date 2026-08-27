import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { DailyPlanRequestService } from "../service/daily-plan-request.service.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";

export const deleteADailyPlanRequestController = asyncHandler(async(req, res) => {

    const id = req.params.id as string
    if(!id) throw new ApiErrorHandler(404, 'id reqiured')

    const dailyPlanService = new DailyPlanRequestService()
    await dailyPlanService.deleteADailyPlanRequest(id)

    res.status(200).json(new apiResponse(null, 'Daily plan deleted successfully'))

})