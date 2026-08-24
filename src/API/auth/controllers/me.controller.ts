import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { UserService } from "../../user/service/user.service.js";


export const meController = asyncHandler(async (req, res) => {
  const id = req.user?.id as string;
  if (!id) throw new ApiErrorHandler(404, "Unauthorized");

  const userService = new UserService();

  // find user
  const user = await userService.findUserById(id);
  if (!user) throw new ApiErrorHandler(404, "Unauthorized !!!");

  res
    .status(200)
    .json(new apiResponse({ user }, "Successfully Created user !"));
});
