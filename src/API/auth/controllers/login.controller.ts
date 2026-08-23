import type { CookieOptions } from "express";
import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { generateToken } from "../../../shared/generate-token.js";
import { LoginInputSchema } from "../validation/login-input.validation.js";
import bcrypt from "bcrypt";
import { apiResponse } from "../../../shared/apiResponseHandler.js";

export const loginController = asyncHandler(async (req, res) => {
  // 1. Validate Input
  const loginValue = LoginInputSchema.parse(req.body);
  const { email, password, deviceToken } = loginValue;

  const normalizedEmail = email.trim().toLowerCase();

  // 2. Find User
  const user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      // verified: true,
    },
  });

  if (!user)
    throw new ApiErrorHandler(404, "User not found or email not verified !");

  // 3. Find Professional profile if present
  const professional = await prisma.professional.findFirst({
    where: { userId: user.id },
  });

  let employee = null;
  if(user.role === 'EMPLOYEE'){
    employee = await prisma.employee.findFirst({
    where: { userId: user.id },
  });
  }

  // 4. Verify Password
  if (!user.password) {
    throw new ApiErrorHandler(400, "Invalid Credential");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiErrorHandler(400, "Invalid Credential");
  }

  // 5. Generate Auth Tokens
  const { accessToken, refreshToken } = await generateToken(user.id);

  // 6. Update Refresh Token in DB
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // 7. Cookie Options
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 8. Strip sensitive credentials from user object
  const { password: _, refreshToken: __, ...userWithoutPassword } = user;

  // 9. Build clean, flat JSON payload
  const responseData = {
    user: userWithoutPassword,
    professional: professional ?? null, // always present, explicit null if none
    employee: employee ?? null,
    accessToken,
    refreshToken,
  };

  // save device token
  // await prisma.deviceToken.create({
  //   data: {
  //     token: deviceToken,
  //     userId: user?.id
  //   }
  // })


  // 10. Single Clean Response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new apiResponse(responseData, "Login successful!"));
});
