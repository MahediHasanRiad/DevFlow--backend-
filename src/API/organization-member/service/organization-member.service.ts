import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { QueryType } from "../../types/types.js";
import type {
  CreateOrganizationMemberInput,
  UpdateOrganizationMemberInput,
} from "../schema/organization.schema.js";

interface ListOfAllOrganizationMemberInput extends QueryType {
  org_Id: string;
}

export class OrganizationMemberService {
  async addNewMember({
    organizationId,
    userId,
    role,
    designation,
  }: CreateOrganizationMemberInput) {
    const organizationMember = await prisma.organizationMember.create({
      data: {
        organizationId,
        userId,
        role,
        designation: designation ?? undefined,
      },
    });
    return organizationMember;
  }

  async findOrganizationMemberById(id: string) {
    try {
      const organizationMember = await prisma.organizationMember.findUnique({
        where: {
          id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
              contact: true,
            },
          },
        },
      });
      return organizationMember;
    } catch (error: any) {
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }

  async findOrganizationMemberByUserId({userId, organizationId}: {userId: string, organizationId: string}) {
    try {
      const organizationMember = await prisma.organizationMember.findFirst({
        where: {
          userId: userId,
          organizationId: organizationId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
              contact: true,
            },
          },
        },
      });
      return organizationMember;
    } catch (error: any) {
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }

  async updateOrganizationMember({
    id,
    role,
    designation,
  }: UpdateOrganizationMemberInput) {
    try {
      const organizationMember = await prisma.organizationMember.update({
        where: {
          id,
        },
        data: {
          role: role,
          designation: designation,
        },
      });
      return organizationMember;
    } catch (error: any) {
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }

  async deleteOrganizationMember(id: string) {
    try {
      await prisma.organizationMember.delete({
        where: {
          id,
        },
      });
      return true;
    } catch (error: any) {
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }

  async listOfAllOrganizationMembers({
    org_Id,
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = "createdAt",
    search = "",
  }: ListOfAllOrganizationMemberInput) {
    try {
      const skip = (page - 1) * limit;

      const organizationMembers = await prisma.organizationMember.findMany({
        where: {
          organizationId: org_Id,
          OR: [{ user: { name: { contains: search, mode: "insensitive" } } }],
        },
        skip,
        take: limit,
        orderBy: {
          [sortType]: sortBy,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true,
              contact: true,
            },
          },
        },
      });

      const total = await prisma.organizationMember.count({
        where: { organizationId: org_Id },
      });
      return { data: organizationMembers, total, page, limit };
    } 
    catch (error: any) {
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }
}
