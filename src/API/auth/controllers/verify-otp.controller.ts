import type { CookieOptions } from "express";
import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma.js";


export const VerifyOTPController = asyncHandler(async(req, res) => {
    const {otp, email} = req.body
    if(!otp) throw new ApiErrorHandler(404, 'OTP not found')
    if(!email) throw new ApiErrorHandler(404, 'email not found')

    // verify OTP
    const getOTP = await redis.get(`otp:${email}`)
    if(getOTP !== otp) throw new ApiErrorHandler(403, 'Invalid OTP or Expired !!!')

    // 3. Find user in Database
    const user = await prisma.user.findFirst({
      where: { AND: [{ email: email }] },
    });
    if (!user) throw new ApiErrorHandler(404, "User not found");

    // 4. Update user verification status
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
      select: {
        id: true,
        name: true,
        email: true,
        contact: true,
        avatar: true,
        role: true,
        taken_services: true,
        longitude: true,
        latitude: true,
        address: true,
        bio: true,
        rating: true,
      },
    });

    // 5. Delete OTP from Redis after success
    await redis.del(`otp:${email}`);

    // 6. Generate JWT Access Token
    const accessToken = jwt.sign(
      {
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY || "",
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DATE || "7d" } as any,
    );

    // 7. Cookie Options
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    // 8. Send Response
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new apiResponse(
          { user: updatedUser, accessToken },
          "Email verified successfully!",
        ),
      );

    res.status(200).json(new apiResponse(getOTP, 'success'))
})