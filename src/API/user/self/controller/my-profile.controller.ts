import { ApiErrorHandler } from "../../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../../shared/asyncHandler.js";
import { FindUser } from "../../../../utils/user/user.js";

export const MyProfileController = asyncHandler(async(req, res) => {
    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'unauthorized')

    const user = await FindUser(userId)

    res.status(200).json(new apiResponse(user, 'success'))
})