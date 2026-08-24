import bcrypt from 'bcrypt';
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ResetPassSchema } from "../validation/reset-password.validation.js";
import { apiResponse } from '../../../shared/apiResponseHandler.js';
import { AuthService } from '../service/register.service.js';
import { UserService } from '../../user/service/user.service.js';

export const resetPasswordController = asyncHandler(async(req, res) => {

    const authService = new AuthService()
    const userService = new UserService()

    const inputValue = ResetPassSchema.parse(req.body)
    const { oldPassword, newPassword } = inputValue

    const id = req?.user?.id as string
    if(!id) throw new ApiErrorHandler(401, 'Unauthorized !!!')

    const user = await userService.findUserById(id)
    if(!user) throw new ApiErrorHandler(401, 'Unauthorized !!!')

    // verify password
    if (!user.password) throw new ApiErrorHandler(401, 'Unauthorized !!!')
    const verifyOld = await bcrypt.compare(oldPassword, user.password)
    if(!verifyOld) throw new ApiErrorHandler(400, 'invalid old password')

    // hash password
    const hashPass = await bcrypt.hash(newPassword, 10)

    // update password
    await authService.updatePassword({id, hashPass})
   
    // response 
    res.status(200).json(new apiResponse('update', 'Password Updated !!!'))
    
})