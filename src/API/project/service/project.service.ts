import { prisma } from "../../../lib/prisma.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import type { ProjectType } from "../schema/project.schema.js";

interface AddNewProjectProp extends ProjectType {
  createdById: string;
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
  }: AddNewProjectProp):Promise<ProjectType> {
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
      return response
    } catch (error) {
      console.error(error);
      throw new ApiErrorHandler(
        400,
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
