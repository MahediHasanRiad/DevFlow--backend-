import { prisma } from "../../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../../shared/asyncHandler.js";
import { FindUser } from "../../../../utils/user/user.js";

export const deleteAUserController = asyncHandler(async(req, res) => {
    const userId = req.params.userId as string
    if(!userId) throw new ApiErrorHandler(404, 'user id required')

    const user = await FindUser(userId)
    if(!user) throw new ApiErrorHandler(404, 'user not found')

    await prisma.user.delete({where: {id: userId}})

    res.status(204).json(new apiResponse(null, 'success'))
})