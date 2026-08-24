import { prisma } from "../../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../../shared/asyncHandler.js";
import { UserService } from "../service/user.service.js";

export const deleteAUserController = asyncHandler(async(req, res) => {
    const userId = req.params.userId as string
    if(!userId) throw new ApiErrorHandler(404, 'user id required')

    const userService = new UserService()

    const user = await userService.findUserById(userId)
    if(!user) throw new ApiErrorHandler(404, 'user not found')

    await userService.deleteUser({id:user?.id})

    res.status(204).json(new apiResponse(null, 'success'))
})