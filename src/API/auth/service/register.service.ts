import type {
  CreateUserInput,
} from "../validation/register-input.validation.js";
import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import bcrypt from "bcrypt";

interface RegisterUser extends CreateUserInput {
  id: string
  emailVerified: boolean
  refreshToken: string
}

export class AuthService {
  constructor() {}

  async ExitEmail(email: string): Promise<RegisterUser> {
    try {
      const existEmail = await prisma.user.findFirst({ where: { email } });
      if (existEmail) throw new ApiErrorHandler(400, "User already Exist !!!");
      return existEmail;
    } catch (error) {
      throw error;
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const hashPass = await bcrypt.hash(password, 10);
      return hashPass;
    } catch (error) {
      throw error;
    }
  }

  async verifyHashPassword({
    hashPassword,
    password,
  }: {
    hashPassword: string;
    password: string;
  }): Promise<boolean> {
    try {
      const hashPass = await bcrypt.compare(hashPassword, password);
      return hashPass;
    } catch (error) {
      throw error;
    }
  }

  async updateRefreshToken({id, refreshToken}: {id: string, refreshToken: string}) {
    try {
      const response = await prisma.user.update({
        where: { id: id },
        data: { refreshToken },
      });
      return response
    } catch (error) {
      console.log(error);
    }
  }

  async deleteDeviceToken(){
    try {
      
    } catch (error) {
      console.error(error)
      throw Error
    }
  }

  async updatePassword({id, hashPass}: {id: string, hashPass: string}): Promise<void>{
    try {
      const response = await prisma.user.update({where: {id: id}, data: {password: hashPass}})
    } catch (error) {
      console.log(error)
      throw Error
    }
  }
}
