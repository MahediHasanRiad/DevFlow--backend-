import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";

export const meController = asyncHandler(async (req, res) => {
  const id = req.user?.id as string;
  if (!id) throw new ApiErrorHandler(404, "Unauthorized");

  // find user
  const user = await prisma.user.findFirst({
    where: { id: id },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      contact: true,
      role: true,
      taken_services: true,
      latitude: true,
      longitude: true,
      address: true,
      bio: true,
      rating: true,
    },
  });
  if (!user) throw new ApiErrorHandler(404, "Unauthorized !!!");

  // check professional or not
  const professional = await prisma.professional.findFirst({
    where: { userId: user.id },
  });

  let employee = null;
  if (user.role === "EMPLOYEE") {
    employee = await prisma.employee.findFirst({
      where: { userId: user.id },
    });
  }


    res
      .status(200)
      .json(
        new apiResponse({ user, professional, employee }, "Successfully Created user !"),
      );

});
