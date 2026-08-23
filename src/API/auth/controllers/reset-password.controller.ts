import bcrypt from 'bcrypt';
import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ResetPassSchema } from "../validation/reset-password.validation.js";
import { apiResponse } from '../../../shared/apiResponseHandler.js';

export const resetPasswordController = asyncHandler(async(req, res) => {

    const inputValue = ResetPassSchema.parse(req.body)
    const { oldPassword, newPassword } = inputValue

    const id = req?.user?.id as string
    if(!id) throw new ApiErrorHandler(401, 'Unauthorized !!!')

    const user = await prisma.user.findFirst({where: {id: id}})
    if(!user) throw new ApiErrorHandler(401, 'Unauthorized !!!')

    // verify password
    if (!user.password) throw new ApiErrorHandler(401, 'Unauthorized !!!')
    const verifyOld = await bcrypt.compare(oldPassword, user.password)
    if(!verifyOld) throw new ApiErrorHandler(400, 'invalid old password')

    // hash password
    const hashPass = await bcrypt.hash(newPassword, 10)

    // update password
    await prisma.user.update({where: {id: id}, data: {password: hashPass}})

    // response 
    res.status(200).json(new apiResponse('update', 'Password Updated !!!'))
    
})