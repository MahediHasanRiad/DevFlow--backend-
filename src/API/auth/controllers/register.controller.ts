import type { Request, Response } from "express";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import redis from "../../../config/redis.js";
import { AuthService } from "../service/register.service.js";
import { RegisterInputSchema } from "../validation/register-input.validation.js";
import { UserService } from "../../user/service/user.service.js";
import { CloudinaryFileUpload } from "../../../shared/cloudinary.js";


export const registerController = asyncHandler(async (req, res) => {

  const avatar = req.file?.path as any
  const data = {
    ...req.body,
    avatar: avatar
  }

  // input validation
  const inputValidation = RegisterInputSchema.parse(data);
  const { name, email, password } = inputValidation;

  // check email exist or not
  const authService = new AuthService();
  const userService = new UserService();

  const existEmail = await userService.findUserByEmail(email)
  if (existEmail) throw new ApiErrorHandler(404, "user already created");

  // save in redis
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(`otp:${email}`, otp, {
    EX: 300,
  });


  // hash password
  const hashPass = await authService.hashPassword(password);
  if (!hashPass) throw new ApiErrorHandler(500, "failed to hash password");

  // upload in cloudinary
  const avatarURL = await CloudinaryFileUpload(avatar)

  // create user
  await userService.createUser({
    name,
    email,
    password: hashPass,
    avatar: avatarURL ?? null,
  })

  //response
  res
    .status(201)
    .json(new apiResponse("send otp", "Successfully Created user !"));
});
