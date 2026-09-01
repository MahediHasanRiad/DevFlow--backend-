import type { UserRoleType } from "../API/auth/validation/register-input.validation.js";




declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRoleType;
      };
    }
  }
}