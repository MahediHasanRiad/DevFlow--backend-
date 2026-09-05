import type { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../shared/asyncHandler.js";

const authVerify = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Extract token from cookie or Authorization header
    const authHeader = req.header("Authorization");
    const token =
      req.cookies?.accessToken ||
      (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

    if (!token) {
      throw createError(401, "Unauthorized: No token provided");
    }

    // 2. Verify JWT token safely
    let payload: JwtPayload & { id?: string };
    try {
      payload = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_KEY as string
      ) as JwtPayload & { id?: string };
    } 
    catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "jwt expired");
      }
      if (error.name === "JsonWebTokenError") {
        throw createError(401, "invalid token");
      }
      throw createError(401, "Authentication failed");
    }

    // 3. Validate payload and check if user exists in database
    if (!payload?.id) {
      throw createError(401, "Invalid token payload");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw createError(404, "User not found");
    }
    console.log('pay', payload)
    // 4. Attach user object to request
    req.user = user;
    req!.user!.orgId = payload.orgId as string
    // req.user.orgRole = payload.organizationRole as string

    next();
  }
);

export { authVerify };