import crypto from "crypto";

export function generateOTP(length: number = 6): string {
  const min = Math.pow(10, length - 1); // e.g., 100000 for 6 digits
  const max = Math.pow(10, length) - 1; // e.g., 999999 for 6 digits
  
  // crypto.randomInt is cryptographically secure and includes min, excludes max
  return crypto.randomInt(min, max + 1).toString();
}