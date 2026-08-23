import { prisma } from "../../../../lib/prisma.js";
import { apiResponse } from "../../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../../shared/asyncHandler.js";

export const allUserListController = asyncHandler(async(req, res) => {
    const allUser = await prisma.user.findMany({where: {}})

    res.status(200).json(new apiResponse(allUser, 'success'))
})