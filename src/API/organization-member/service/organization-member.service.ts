import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { CreateOrganizationMemberInput } from "../schema/organization.schema.js";

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
      });
      return organizationMember;
    } catch (error: any) {
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }
}
