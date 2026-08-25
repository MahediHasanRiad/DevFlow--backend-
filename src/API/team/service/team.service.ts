import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type {
  QueryType,
  TeamMemberType,
} from "../../types/types.js";
import type {
  CreateTeamInput,
  TeamType,
} from "../schema/team.schema.js";

interface UpdateTeamProp {
  id: string;
  updatedData: {
    name?: string;
    description?: string;
  };
}

export class TeamService {
  async addNewTeam({
    name,
    description,
    createdById,
  }: CreateTeamInput): Promise<TeamType> {
    try {
      const response = await prisma.team.create({
        data: {
          name,
          description,
          createdById,
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

  async updateTeam({ id, updatedData }: UpdateTeamProp): Promise<TeamType> {
    try {
      const response = await prisma.team.update({
        where: { id },
        data: {
          name: updatedData.name,
          description: updatedData.description,
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

  async findATeamById(id: string): Promise<TeamType> {
    try {
      const response = await prisma.team.findFirst({ where: { id } });
      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async deleteATeamById(id: string): Promise<TeamType> {
    try {
      const response = await prisma.team.delete({ where: { id } });
      return response;
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async allTeamLists({
    page,
    limit,
    sortBy,
    sortType,
    search,
  }: QueryType): Promise<TeamType[]> {
    try {
      const teamsList = await prisma.team.findMany({
        where: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      });
      const teamMembers = await prisma.teamMember.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              role: true,
              designation: true,
            },
          },
        },
      });

      // 1. Initialize the map with all teams
      const teamMap = new Map<
        string,
        {
          id: string;
          name: string;
          createdById: string;
          description: string | null;
          members: TeamMemberType[];
        }
      >();

      teamsList.forEach((team: TeamType) => {
        teamMap.set(team.id, {
          id: team.id,
          name: team.name,
          createdById: team.createdById,
          description: team.description ?? null,
          members: [],
        });
      });

      // 2. Populate members under their respective teams
      teamMembers.forEach((member: any) => {
        const targetTeam = teamMap.get(member.teamId);
        if (targetTeam) {
          targetTeam.members.push(member.user);
        }
      });

      // 3. Convert Map values back to an array
      const response = Array.from(teamMap.values());
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
