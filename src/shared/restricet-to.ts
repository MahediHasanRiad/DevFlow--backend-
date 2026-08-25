import type { NextFunction, Request, Response } from "express";
import { ApiErrorHandler } from "./apiErrorHandler.js";

type RoleType = "EMPLOYEE" | "PROJECT_MANAGER" | "ADMIN" ;

export const RestrictTo = (...allowedRoles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      throw new ApiErrorHandler(401, "Unauthorized. Please log in.");
    }

    if (!allowedRoles.includes(role as RoleType)) {
      throw new ApiErrorHandler(
        403,
        "Forbidden. You do not have permission to perform this action."
      );
    }
    next();
  };
};