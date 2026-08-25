import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { QueryType } from "../../types/types.js";
import type {
  ProjectType,
  UpdateProjectInputType,
} from "../schema/project.schema.js";

interface AddNewProjectProp extends ProjectType {
  createdById: string;
}

export interface UpdateProjectProp {
  id: string;
  updatedData: UpdateProjectInputType;
}

export class ProjectService {
  async AddNewProject({
    createdById,
    name,
    description,
    status,
    progress,
    startDate,
    deadline,
    totalMileStone,
    completedMileStone,
    amount,
    receivedAmount,
  }: AddNewProjectProp): Promise<ProjectType> {
    try {
      const response = await prisma.project.create({
        data: {
          createdById: createdById,
          name,
          description,
          status,
          progress,
          startDate,
          deadline,
          totalMileStone,
          completedMileStone,
          amount,
          receivedAmount,
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

  async UpdateProject({
    id,
    updatedData,
  }: UpdateProjectProp): Promise<ProjectType> {
    try {
      const response = await prisma.project.update({
        where: { id: id },
        data: updatedData,
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

  async findAProjectById(projectId: string): Promise<ProjectType> {
    try {
      const response = await prisma.project.findFirst({
        where: { id: projectId },
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

  async deleteAProjectById(projectId: string): Promise<void> {
    try {
      await prisma.project.delete({
        where: { id: projectId },
      });
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async allProjectList({
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = "updatedAt",
    search = "",
  }: QueryType): Promise<any[]> {
    try {
      const skip = (Math.max(1, page) - 1) * limit;

      const response = await prisma.project.findMany({
        where: search.trim()
          ? {
              OR: [
                { name: { contains: search.trim(), mode: "insensitive" } },
                {
                  description: { contains: search.trim(), mode: "insensitive" },
                },
              ],
            }
          : {},
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          [sortType]: sortBy,
        },
        skip,
        take: limit,
      });

      return response;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
}
