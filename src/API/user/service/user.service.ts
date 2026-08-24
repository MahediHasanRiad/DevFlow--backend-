import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type {
  CreateUserInput,
  DesignationType,
  UserRoleType,
} from "../../auth/validation/register-input.validation.js";

interface CreateUserPropType {
  name: string;
  email: string;
  role: UserRoleType;
  password: string;
  designation: DesignationType;
  avatar?: string;
}

interface RegisterUser extends CreateUserInput {
  id: string;
  emailVerified: boolean;
  refreshToken: string;
}

export class UserService {
  
  async findUserByEmail(email: string): Promise<RegisterUser> {
    try {
      const existEmail = await prisma.user.findFirst({
        where: { AND: [{ email }] },
      });
      return existEmail;
    } catch (error) {
      console.error(error);
      throw Error;
    }
  }

  async findUserById(id: string): Promise<RegisterUser> {
    try {
      const response = await prisma.user.findFirst({
        where: { AND: [{ id }, { emailVerified: true }] },
      });
      if (!response) throw new ApiErrorHandler(404, "User not found");
      return response;
    } catch (error) {
      console.error(error);
      throw Error;
    }
  }

  async createUser({
    name,
    email,
    role,
    password,
    designation,
    avatar
  }: CreateUserPropType): Promise<RegisterUser> {
    try {
      const createdUser = await prisma.user.create({
        data: {
          name,
          email,
          role: role ?? "EMPLOYEE",
          password: password,
          designation,
          avatar,
        },
      });
      return createdUser;
    } catch (error:unknown) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async updateUserEmailVerification({ id }: { id: string }) {
    try {
      const response = await prisma.user.update({
        where: { id: id },
        data: { emailVerified: true },
        select: {
          id: true,
          name: true,
          email: true,
          contact: true,
          avatar: true,
          role: true,
          designation: true,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw Error;
    }
  }

  async updateUserVerification({
    id,
    refreshToken,
  }: {
    id: string;
    refreshToken: string;
  }): Promise<RegisterUser> {
    try {
      const updated = await prisma.user.update({
        where: { id: id },
        data: { verified: true, refreshToken: refreshToken },
      });
      return updated;
    } catch (error) {
      console.error(error);
      throw Error;
    }
  }

  async deleteUser({id}:{id:string}):Promise<void>{
    try {
      const response = await prisma.user.delete({where: {id: id}})
      return response
    } catch (error) {
      console.error(error)
      throw Error
    }
  }
}
