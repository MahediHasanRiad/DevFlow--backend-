import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { QueryType } from "../../types/types.js";
import type {
  CreateOrganizationInputType,
  UpdateOrganizationInputType,
} from "../schema/organization.schema.js";

interface CreateUserOrgPropsType extends CreateOrganizationInputType {
  user_Id: string;
}

export class OrganizationService {
  async findOrganizationByName(name: string) {
    try {
      const response = await prisma.organization.findFirst({
        where: {
          name,
        },
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(500, "Error finding organization");
    }
  }

  async findOrganizationById(id: string) {
    try {
      const response = await prisma.organization.findFirst({
        where: {
          id,
        },
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(500, "Error finding organization");
    }
  }

  async findOrganizationByUserId(userId: string) {
    try {
      const response = await prisma.organization.findFirst({
        where: {
          userId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              contact: true,
              avatar: true,
            },
          },
        },
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(500, "Error finding organization");
    }
  }

  async deleteOrganizationById(id: string) {
    try {
      const response = await prisma.organization.delete({
        where: {
          id,
        },
      });
      return response;
    } catch (error) {
      throw new ApiErrorHandler(500, "Error finding organization");
    }
  }

  async createOrganization({ name, slug, user_Id }: CreateUserOrgPropsType) {
    try {
      const result = await prisma.organization.create({
        data: {
          name,
          slug,
          userId: user_Id,
        },
      });
      return result;
    } catch (error) {
      throw new ApiErrorHandler(500, "Error creating organization");
    }
  }

  async updateOrganization(id: string, data: UpdateOrganizationInputType) {
    try {
      const result = await prisma.organization.update({
        where: { id },
        data: data,
      });
      return result;
    } catch (error) {
      throw new ApiErrorHandler(500, "Error updating organization");
    }
  }

  async listOfAllOrganization({
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = "createdAt",
    search = "",
  }: QueryType) {
    try {
      const skip = (page - 1) * limit; 
      const organizations = await prisma.organization.findMany({
      where: search.trim()
        ? {
            name: {
              contains: search.trim(),
              mode: "insensitive",
            },
          }
        : {},
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortType]: sortBy,
      },
    });
      return organizations;
    } catch (error) {
  console.error("DEBUG - Full Organization Error:", error); 
   new ApiErrorHandler(500, "Error finding organization");
    }
  }

  async checkOrgAdmin(orgId:string, userId:string){
    try {
      const response = await prisma.organization.findFirst({where: {id: orgId, userId}})
      return response
    } catch (error) {
      throw new ApiErrorHandler(500, "Error in checking organization admin.");
    }
  }
}
