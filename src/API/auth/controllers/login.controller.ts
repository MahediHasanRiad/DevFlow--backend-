import type { CookieOptions } from "express";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { generateToken } from "../../../shared/generate-token.js";
import { LoginInputSchema } from "../validation/login-input.validation.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { AuthService } from "../service/register.service.js";
import { UserService } from "../../user/self/service/user.service.js";

export const loginController = asyncHandler(async (req, res) => {
  // 1. Validate Input
  const loginValue = LoginInputSchema.parse(req.body);
  const { email, password, deviceToken } = loginValue;

  const normalizedEmail = email.trim().toLowerCase();
  const authService = new AuthService();
  const userService = new UserService();

  // 2. Find User
  const user = await userService.findUserByEmail(normalizedEmail);

  if (!user)
    throw new ApiErrorHandler(404, "User not found or email not verified !");

  // 4. Verify Password
  if (!user.password) {
    throw new ApiErrorHandler(400, "Invalid Credential");
  }

  const isPasswordValid = await authService.verifyHashPassword({
    hashPassword: password,
    password: user?.password,
  });
  if (!isPasswordValid) {
    throw new ApiErrorHandler(400, "Invalid Credential");
  }

  // 5. Generate Auth Tokens
  const { accessToken, refreshToken } = await generateToken(user.id);

  // 6. Update Refresh Token in DB
  await authService.updateRefreshToken({id:user?.id, refreshToken})

  // 7. Cookie Options
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 8. Strip sensitive credentials from user object
  const { password: _, ...userWithoutPassword } = user;

  // 9. Build clean, flat JSON payload
  const responseData = {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };

  // 10. Single Clean Response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new apiResponse(responseData, "Login successful!"));
});
