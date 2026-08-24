import type { CookieOptions } from "express";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { generateToken } from "../../../shared/generate-token.js";
import { AuthService } from "../service/register.service.js";
import { UserService } from "../../user/self/service/user.service.js";

export const resetRefreshTokenController = asyncHandler(async (req, res) => {

  const authService = new AuthService()
  const userService = new UserService()

    // incoming refresh token
  const incomingRefreshToken =
    req.cookies?.refreshToken || (req.headers["x-refresh-token"] as string);

  if (!incomingRefreshToken) {
    throw new ApiErrorHandler(
      401,
      "Refresh token is missing. Please log in again !!!",
    );
  }

  // 2. Extract user ID
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiErrorHandler(401, "Invalid session details !!!");
  }

  // 3. Find user by ID
  const user = await userService.findUserById(userId)

  if (!user) {
    throw new ApiErrorHandler(
      404,
      "User associated with this token no longer exists !!!",
    );
  }

  // 4. Compare the incoming token with the one saved in the database
  if (user?.refreshToken !== incomingRefreshToken) {
    throw new ApiErrorHandler(
      403,
      "Refresh token is invalid or has expired !!!",
    );
  }

  // 5. Generate a NEW pair of tokens
  const { accessToken, refreshToken: newRefreshToken } = await generateToken(
    user.id,
  );

  // 6. Update ONLY the refresh token in the database
  await authService.updateRefreshToken({id:user.id, refreshToken:newRefreshToken})

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 7. set cookie
  res.cookie("refreshToken", newRefreshToken, cookieOptions);
  res.cookie("accessToken", accessToken, cookieOptions);


  // 8. Return response containing the new access token
  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken,
  });
});
