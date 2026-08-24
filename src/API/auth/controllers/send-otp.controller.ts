import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { sendEmailService } from "../../../config/send-mail.js";
import { getOTPTemplate } from "../../../shared/email-template.js";

export const SendOTPController = asyncHandler(async (req, res) => {

  const email = req.body.email as string;
  if (!email) throw new ApiErrorHandler(404, "Email not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // const send = await sendEmailService({
  //   to: email,
  //   subject: "text mail",
  //   otp: getOTPTemplate(otp),
  // });

  // save in redis
  await redis.set(`otp:${email}`, otp, {
    EX: 300,
  });

  res.status(200).json(new apiResponse('send', "success"));
});
