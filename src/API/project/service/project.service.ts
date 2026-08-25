import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
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

  async findAProjectById(projectId: string) {
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
}
