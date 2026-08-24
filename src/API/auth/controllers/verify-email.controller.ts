import type { CookieOptions } from "express";
import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { generateToken } from "../../../shared/generate-token.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { UserService } from "../../user/self/service/user.service.js";

export const VerifyEmailController = asyncHandler(async (req, res) => {

  const userService = new UserService();

  const { otp, email } = req.body;
  if (!otp) throw new ApiErrorHandler(404, "OTP not found");
  if (!email) throw new ApiErrorHandler(404, "email required");

  // find otp from redis
  const getOTP = await redis.get(`otp:${email}`);
  if (otp !== getOTP)
    throw new ApiErrorHandler(400, "Invalid OTP or expired !!!");

  const verifyEmail = await userService.findUserByEmail(email);
  if (!verifyEmail) throw new ApiErrorHandler(400, "Invalid email");

  // generate token
  const { accessToken, refreshToken } = await generateToken(verifyEmail.id);

  // update verification
  const user = await userService.updateUserVerification({
    id: verifyEmail.id,
    refreshToken,
  });

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  //response
  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        { user, accessToken, refreshToken },
        "Successfully Created user !",
      ),
    );
});
