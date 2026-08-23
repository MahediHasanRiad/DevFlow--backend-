import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { SideContentSchema } from "../schema/side-content.schema.js";

export const PrivacyPolicyController = asyncHandler(async (req, res) => {
  const inputType = SideContentSchema.parse(req.body);
  const { title, content } = inputType;

  const privacy = await prisma.sideContent.create({
    data: {
      title: title ?? "",
      content: content ?? "",
    },
  });

  res.status(201).json(new apiResponse(privacy, "success"));
});
export const UpdatePrivacyPolicyController = asyncHandler(async (req, res) => {
  const privacyId = req.params.privacyId as string;
  if (!privacyId) throw new ApiErrorHandler(404, "privacy id required");

  const inputType = SideContentSchema.parse(req.body);
  const { title, content } = inputType;

  const updatedData: any = {};
  if (title !== undefined) updatedData.title = title;
  if (content !== undefined) updatedData.content = content;

  const privacy = await prisma.sideContent.update({
    where: { id: privacyId },
    data: updatedData,
  });

  res.status(201).json(new apiResponse(privacy, "success"));
});

export const FindPrivacyPolicyController = asyncHandler(async (req, res) => {
  const privacyId = req.params.privacyId as string;
  if (!privacyId) throw new ApiErrorHandler(404, "privacy id required");

  const privacy = await prisma.sideContent.findFirst({
    where: { id: privacyId },
  });
  if (!privacy) throw new ApiErrorHandler(404, "Privacy page not found");

  res.status(201).json(new apiResponse(privacy, "success"));
});
