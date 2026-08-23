import { Router } from "express";
import { registerController } from "../controllers/register.controller.js";
import { loginController } from "../controllers/login.controller.js";
import { resetPasswordController } from "../controllers/reset-password.controller.js";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { meController } from "../controllers/me.controller.js";
import { resetRefreshTokenController } from "../controllers/reset-refresh-token.controller.js";
import { googleAuthController } from "../provider/google.provider.js";
import { appleAuthController } from "../provider/apple.provider.js";
import { SendOTPController } from "../controllers/send-otp.controller.js";
import { VerifyOTPController } from "../controllers/verify-otp.controller.js";
import { SaveDeviceTokenController } from "../controllers/user-device-token.controller.js";
import { VerifyEmailController } from "../controllers/verify-email.controller.js";
import { logoutController } from "../controllers/logout.controller.js";
import { updatePasswordController } from "../controllers/update-password.controller.js";


const authRouter = Router()

authRouter.post('/register', registerController)
authRouter.post('/verify-register-user', VerifyEmailController)
authRouter.post('/google', googleAuthController)
authRouter.post('/apple', appleAuthController)
authRouter.post('/login', loginController)
authRouter.post('/logout', authVerify, logoutController)
authRouter.post('/send-otp', SendOTPController)
authRouter.post('/verify-opt', VerifyOTPController)
authRouter.post('/reset-password', authVerify, resetPasswordController)
authRouter.post('/update-password', authVerify, updatePasswordController)
authRouter.get('/me', authVerify, meController)
authRouter.get('/reset-refresh-token', authVerify, resetRefreshTokenController)
authRouter.post('/device-token', authVerify, SaveDeviceTokenController)


export {authRouter}