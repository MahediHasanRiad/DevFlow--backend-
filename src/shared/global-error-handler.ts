import type { Request, Response, NextFunction } from "express";
import { ApiErrorHandler } from "./apiErrorHandler.js";

export const globalErrorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof ApiErrorHandler ? err.statusCode : err.statusCode || 500;
  
  // Try parsing the message if it's stringified JSON (like Zod errors)
  let formattedMessage: any = err.message || "Internal Server Error";
  try {
    formattedMessage = JSON.parse(err.message);
  } catch {
    // If it's a normal string, leave it as is
    formattedMessage = err.message || "Internal Server Error";
  }

  console.error(`[Error] ${req.method} ${req.url} - ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: formattedMessage, // Pass object directly instead of template string `${message}`
  });
};