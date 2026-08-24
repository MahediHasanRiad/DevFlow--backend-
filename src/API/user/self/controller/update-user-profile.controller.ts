import { prisma } from "../../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../../shared/asyncHandler.js";
import { CloudinaryFileUpload } from "../../../../shared/cloudinary.js";
import { updateUserSchema, type UpdateUserInput } from "../schema/update-user-profile.schema.js";
import { UserService } from "../service/user.service.js";

export const UpdateUserProfileController = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) throw new ApiErrorHandler(401, "Unauthorized");

  const userService = new UserService()

  const user = await userService.findUserById(userId)
  if (!user) throw new ApiErrorHandler(404, "User not found");

  // 1. Upload to Cloudinary FIRST if a file exists
  let avatarUrl: string | undefined;
  if (req.file?.path) {
    avatarUrl = await CloudinaryFileUpload(req.file.path);
  }

  // 2. Parse req.body with Zod (including Cloudinary avatar URL if present)
  const parsedData:UpdateUserInput = updateUserSchema.parse({
    ...req.body,
    ...(avatarUrl && { avatar: avatarUrl }),
  });

  // 3. Build update object (only includes fields that were explicitly sent)
  const updatedData: Record<string, any> = {};

  if (parsedData.name !== undefined) updatedData.name = parsedData.name;
  if (parsedData.email !== undefined) updatedData.email = parsedData.email;
  if (parsedData.contact !== undefined) updatedData.contact = parsedData.contact;
  if (parsedData.latitude !== undefined) updatedData.latitude = parsedData.latitude;
  if (parsedData.longitude !== undefined) updatedData.longitude = parsedData.longitude;
  if (parsedData.address !== undefined) updatedData.address = parsedData.address;
  if (parsedData.bio !== undefined) updatedData.bio = parsedData.bio;
  if (parsedData.stripeAccountId !== undefined) updatedData.stripeAccountId = parsedData.stripeAccountId;
  if (parsedData.avatar !== undefined) updatedData.avatar = parsedData.avatar;

  // 4. Update Prisma Database
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updatedData,
    select: {
      id: true,
      name: true,
      email: true,
      contact: true,
      avatar: true,
      address: true,
      role: true,
    },
  });

  res.status(200).json(new apiResponse(updatedUser, "Profile updated successfully"));
});