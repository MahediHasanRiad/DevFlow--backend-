import { prisma } from "../../../lib/prisma.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";


export const SaveDeviceTokenController = asyncHandler(async(req, res) => {
    const { token, deviceType } = req.body;
    const userId = req.user?.id; // From your auth middleware
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    
    if (!token) {
      res.status(400).json({ message: "Token is required" });
      return;
    }


    // Upsert so the token isn't duplicated
    await prisma.deviceToken.upsert({
      where: { token },
      update: {
        userId,
        deviceType: deviceType || "WEB",
      },
      create: {
        token,
        userId,
        deviceType: deviceType || "WEB",
      },
    });

    res.status(200).json({ message: "Device token saved successfully" });
})