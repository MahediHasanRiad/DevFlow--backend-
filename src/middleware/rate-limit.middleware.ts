import rateLimit from "express-rate-limit";

// 1. OTP Verification Rate Limit (3 attempts per 5 minutes)
export const OTPrateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    success: false,
    message:
      "Too many OTP verification attempts. Please try again after 5 minutes.",
  },
});

// 2. Password Reset Rate Limit (5 attempts per 5 minutes is generally safer than 10)
export const passwordRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    success: false,
    message:
      "Too many password reset requests. Please try again after 5 minutes.",
  },
});