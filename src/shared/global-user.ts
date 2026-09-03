
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        orgId: string;
        orgRole: "EMPLOYEE" | "PROJECT_MANAGER" | "ADMIN";
      };
    }
  }
}