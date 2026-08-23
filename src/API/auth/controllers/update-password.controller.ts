import bcrypt from 'bcrypt';
import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { apiResponse } from '../../../shared/apiResponseHandler.js';
import { UpdatePassSchema } from '../validation/update-password.validation copy.js';

export const updatePasswordController = asyncHandler(async(req, res) => {

    const inputValue = UpdatePassSchema.parse(req.body)
    const { email, newPassword } = inputValue


    const user = await prisma.user.findFirst({where: {email: email}})
    if(!user) throw new ApiErrorHandler(401, 'user not found !!!')

    // hash password
    const hashPass = await bcrypt.hash(newPassword, 10)

    // update password
    await prisma.user.update({where: {id: user.id}, data: {password: hashPass}})

    // response 
    res.status(200).json(new apiResponse('update', 'Password Updated !!!'))
    
})