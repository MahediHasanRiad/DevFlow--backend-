import type { CookieOptions } from "express";
import appleSignin from "apple-signin-auth";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { prisma } from "../../../lib/prisma.js";
import { generateToken } from "../../../shared/generate-token.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";

export const appleAuthController = asyncHandler(async (req, res) => {

  const { identityToken, name, email: frontendEmail } = req.body;

  if (!identityToken) {
    throw new Error("Apple Identity Token is required.");
  }

  // 1. Verify Apple ID Token signature and audience
  const appleData = await appleSignin.verifyIdToken(identityToken, {
    // Your Apple App ID (iOS) or Service ID (Web/Android)
    audience: process.env.APPLE_CLIENT_ID, 
    ignoreExpiration: false,
  });

  // Extract Apple's unique user identifier and email from token
  const { sub: appleId, email: tokenEmail } = appleData;
  const userEmail = tokenEmail || frontendEmail;

  if (!userEmail) {
    throw new Error("Unable to retrieve email from Apple token.");
  }

  // 2. Find user by appleId or email
  let user = await prisma.user.findFirst({
    where: {
      OR: [{ appleId }, { email: userEmail }],
    },
  });

  // 3. Create user if they do not exist
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: name || "Apple User", // Apple sends name only on first sign in
        appleId: appleId,
      },
    });
  } else if (!user.appleId) {
    // If user already existed via Email/Password or Google, link their Apple ID
    user = await prisma.user.update({
      where: { id: user.id },
      data: { appleId: appleId },
    });
  }

  // 4. Generate application JWT tokens
  const { accessToken, refreshToken } = await generateToken(user.id);

  // 5. Update refreshToken in DB
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // 6. Set Cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 7. Send Response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        { user: updatedUser, accessToken, refreshToken },
        "Apple authentication successful!"
      )
    );
});