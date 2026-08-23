import type { CookieOptions } from "express";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { prisma } from "../../../lib/prisma.js";
import { generateToken } from "../../../shared/generate-token.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { authAdmin } from "../../../config/firebase-admin.js";



export const googleAuthController = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new Error("ID token is required");
  }

  // 1. Verify the Firebase ID Token using getAuth()
  const decodedToken = await authAdmin.verifyIdToken(idToken);

  if (!decodedToken || !decodedToken.email) {
    throw new Error("Invalid token payload: Email is required");
  }

  const { email, name, picture, uid: googleId } = decodedToken;

  // 2. Find existing user or create a new record
  let user = await prisma.user.findFirst({
    where: { OR: [{ email: email }, { googleId: googleId }] },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || "",
        avatar: picture || "",
        googleId: googleId,
        emailVerified: true,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId: googleId },
    });
  }

  // 3. Generate your application's JWT Tokens
  const { accessToken, refreshToken } = await generateToken(user.id);

  // 4. Save refreshToken to DB
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // 5. Set Cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  // 6. Response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new apiResponse(
        { user: updatedUser, accessToken, refreshToken },
        "Google authentication successful!",
      ),
    );
});