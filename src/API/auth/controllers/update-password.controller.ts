import bcrypt from 'bcrypt';
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { apiResponse } from '../../../shared/apiResponseHandler.js';
import { UpdatePassSchema } from '../validation/update-password.validation copy.js';
import { AuthService } from '../service/register.service.js';
import { UserService } from '../../user/service/user.service.js';

export const updatePasswordController = asyncHandler(async(req, res) => {

    const authService = new AuthService()
    const userService = new UserService()

    const inputValue = UpdatePassSchema.parse(req.body)
    const { email, newPassword } = inputValue


    const user = await userService.findUserByEmail(email)
    if(!user) throw new ApiErrorHandler(401, 'user not found !!!')

    // hash password
    const hashPass = await bcrypt.hash(newPassword, 10)

    // update password
    await authService.updatePassword({id:user.id, hashPass})

    // response 
    res.status(200).json(new apiResponse('update', 'Password Updated !!!'))
    
})