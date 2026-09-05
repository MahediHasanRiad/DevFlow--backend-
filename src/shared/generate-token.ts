import { prisma } from "../lib/prisma.js";
import createError from 'http-errors';
import jwt from "jsonwebtoken";
import { UserService } from "../API/user/service/user.service.js";
import { OrganizationMemberService } from "../API/organization-member/service/organization-member.service.js";


interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

async function generateToken(id: string): Promise<TokenResponse> {
    try {

      const userService = new UserService();
      const organizationMemberService = new OrganizationMemberService(); 
      
        const user = await userService.findUserById(id);
        const userId = user?.id as string;
        const organizationMember = await organizationMemberService.findOrganizationMemberByUserId({userId});

        if (!user) throw createError(404, "User not found for token generation !!!");
    
        // generate access token
        const accessToken = jwt.sign(
          {
            id: user.id,
            name: user.name,
            orgId: organizationMember?.organizationId,
            orgRole: organizationMember?.role?.name 
          },
          process.env.ACCESS_TOKEN_SECRET_KEY as string,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DATE as any },
        );
    
        if (!accessToken)
          throw createError(500, "Failed to generate access token");

        // generate refresh token
        const refreshToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.REFRESH_TOKEN_SECRET_KEY as string, 
          { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_DATE as any },
        );
    
        if (!refreshToken)
          throw createError(500, "Failed to generate refresh token");
    

        return {
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error(error);
        throw error; 
    }
}

export { generateToken };