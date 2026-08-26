import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { responsibilityType } from "../../types/types.js";
import type {
  CreateProjectMemberInputType,
  ProjectMemberType,
} from "../schema/projectMember.schema.js";

interface FindAProjectMemberPropType {
  projectId: string;
  userId: string;
}
interface isUserTeamLeadType {
  projectId: string;
  userId: string;
}
interface updateProjectMemberType {
  id: string;
  responsibility: responsibilityType;
}

export class ProjectMemberService {
  async ExistProjectMember({
    projectId,
    userId,
  }: FindAProjectMemberPropType): Promise<ProjectMemberType> {
    try {
      const response = await prisma.teamMember.findFirst({
        where: {
          projectId,
          userId,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          project: {
            select: {
              name: true,
            },
          },
        },
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async findProjectMemberById(memberId: string): Promise<ProjectMemberType> {
    try {
      const response = await prisma.projectMember.findFirst({
        where: { id: memberId },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async deleteProjectMemberById(memberId: string): Promise<void> {
    try {
      await prisma.projectMember.delete({
        where: { id: memberId },
      });
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async AddNewProjectMember({
    projectId,
    userId,
    responsibility,
  }: CreateProjectMemberInputType): Promise<ProjectMemberType> {
    try {
      const response = await prisma.projectMember.create({
        data: {
          projectId,
          userId,
          responsibility,
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async listOfAllMembersByProject(
    projectId: string,
  ): Promise<ProjectMemberType[]> {
    try {
      const response = await prisma.projectMember.findMany({
        where: { projectId:projectId },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      });

      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async isTeamLead({
    projectId,
    userId,
  }: isUserTeamLeadType): Promise<boolean> {
    try {
      const response = await prisma.projectMember.findFirst({
        where: { AND: [{ projectId: projectId }, { userId: userId }] },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async updateProjectMember({
    id,
    responsibility,
  }: updateProjectMemberType): Promise<ProjectMemberType> {
    try {
      const response = await prisma.projectMember.update({
        where: { id: id },
        data: { responsibility: responsibility },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async findTeamLeadByProject(projectId: string): Promise<ProjectMemberType> {
    try {
      const response = await prisma.projectMember.findFirst({
        where: { AND: [{ projectId: projectId }, { responsibility: "TEAM_LEAD" }]},
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
