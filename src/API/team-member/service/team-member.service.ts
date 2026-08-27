import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { responsibilityType } from "../../types/types.js";
import type {
  CreateTeamMemberType,
  TeamMemberType,
} from "../schema/team-member.schema.js";

interface UpdateProp {
  id: string;
  responsibility: responsibilityType;
}
interface findTeamMemberProp {
  teamId: string;
  userId: string;
}
interface userExistThisTeamProp {
  userId: string;
  teamId: string;
}

export class TeamMemberService {
  async addNewTeamMember({
    teamId,
    userId,
    responsibility,
  }: CreateTeamMemberType): Promise<TeamMemberType> {
    try {
      const response = await prisma.teamMember.create({
        data: {
          teamId,
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

  async updateTeamMember({
    id,
    responsibility,
  }: UpdateProp): Promise<TeamMemberType> {
    try {
      const response = await prisma.teamMember.update({
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

  async CheckTeamLead({
    teamId,
    userId,
  }: findTeamMemberProp): Promise<TeamMemberType> {
    try {
      const response = await prisma.teamMember.findFirst({
        where: {
          teamId: teamId,
          userId: userId,
          responsibility: "TEAM_LEAD",
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

  async findTeamMember(memberId: string): Promise<TeamMemberType> {
    try {
      const response = await prisma.teamMember.findFirst({
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

  async findTeamMemberByUserId(userId: string, teamId: string): Promise<TeamMemberType> {
    try {
      const response = await prisma.teamMember.findFirst({
        where: { userId: userId, teamId:teamId },
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

  async deleteTeamMember(memberId: string): Promise<void> {
    try {
      await prisma.teamMember.delete({
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

  async listOfMembersByTeam(teamId: string): Promise<TeamMemberType[]> {
    try {
      const response = await prisma.teamMember.findMany({
        where: { teamId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contact: true,
              role: true,
              designation: true,
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

  async userExistThisTeam({
    userId,
    teamId,
  }: userExistThisTeamProp): Promise<TeamMemberType> {
    try {
      const response = await prisma.teamMember.findFirst({
        where: { AND: [{ userId: userId }, { teamId: teamId }] },
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
