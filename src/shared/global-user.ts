import type { UserRoleType } from "../API/auth/user.type.js";



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