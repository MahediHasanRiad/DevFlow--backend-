import { ApiErrorHandler } from "../../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../../shared/asyncHandler.js";
import { UserService } from "../service/user.service.js";


export const FindAUserController = asyncHandler(async(req, res) => {

    const userService = new UserService()

    const userId = req.user?.id as string
    if(!userId) throw new ApiErrorHandler(401, 'unauthorized')

    const id = req.params.userId as string
    if(!id) throw new ApiErrorHandler(404, 'user id required !!!')

    const user = await userService.findUserById(id)

    res.status(200).json(new apiResponse(user, 'success'))
})