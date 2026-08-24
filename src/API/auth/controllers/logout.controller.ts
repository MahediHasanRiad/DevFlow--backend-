import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";

export const logoutController = asyncHandler(
  async (req, res) => {
    const { token } = req.body; // FCM token from frontend
    const userId = req.user?.id;

    // if (token && userId) {
    //   await prisma.deviceToken.deleteMany({
    //     where: {
    //       token: token,
    //       userId: userId,
    //     },
    //   });
    // }

    // Clear session cookies and send response
    res
      .status(200)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new apiResponse(null, "Logged out successfully"));
  },
);
