import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { CreateOrganizationMemberInput, UpdateOrganizationMemberInput } from "../schema/organization.schema.js";

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
            }
          }
        }
      });
      return organizationMember;
    } catch (error: any) {
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }

  async updateOrganizationMember({id, role, designation}: UpdateOrganizationMemberInput) {
    try {
      const organizationMember = await prisma.organizationMember.update({
        where: {
          id,
        },
        data:{
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

  async deleteOrganizationMember(id:string){
    try{
      await prisma.organizationMember.delete({
        where:{
          id,
        }
      })
      return true
    }catch(error: any){
      throw new ApiErrorHandler(
        error.statusCode || 500,
        error.message || "Internal Server Error",
      );
    }
  }
}
