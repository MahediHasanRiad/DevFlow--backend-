import type {
  DesignationType,
  UserRoleType,
} from "../validation/register-input.validation.js";
import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import bcrypt from "bcrypt";

interface CreateUserPropType {
  name: string;
  email: string;
  role: UserRoleType;
  password: string;
  designation: DesignationType;
}

interface UpdateUser extends CreateUserPropType {
  id: string;
}

export class AuthService {
  constructor() {}

  async ExitEmail(email: string) {
    try {
      const existEmail = await prisma.user.findFirst({ where: { email } });
      if (existEmail) throw new ApiErrorHandler(400, "User already Exist !!!");
      return existEmail;
    } catch (error) {
      console.error(error);
    }
  }

  async hashPassword(password: string) {
    try {
      const hashPass = await bcrypt.hash(password, 10);
      return hashPass;
    } catch (error) {
      console.error(error);
    }
  }

  async findUserByEmail(email: string) {
    try {
      const existEmail = await prisma.user.findFirst({
        where: { AND: [{ email }, { emailVerified: true }] },
      });
      if (!existEmail) throw new ApiErrorHandler(404, "User not found");
      return existEmail;
    } catch (error) {
      console.error(error);
    }
  }

  async createUser({
    name,
    email,
    role,
    password,
    designation,
  }: CreateUserPropType) {
    try {
      await prisma.user.create({
        data: {
          name,
          email,
          role: role ?? "USER",
          password: password,
          designation,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserVerification({
    id,
    refreshToken
  }: {id: string, refreshToken: string}) {
    try {
      const updated = await prisma.user.update({
        where: { id: id },
        data: { verified: true, refreshToken: refreshToken },
      });
      return updated;
    } catch (error) {
      console.error(error);
    }
  }
}
