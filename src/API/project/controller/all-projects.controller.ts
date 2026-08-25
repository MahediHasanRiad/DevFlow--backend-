import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import type { QueryType } from "../../types/types.js";
import { ProjectService } from "../service/project.service.js";

export const allProjectsController = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "desc",
    sortType = "updatedAt",
    search,
  } = req.params as QueryType;
  page = Number(page);
  limit = Number(limit);

  const projectService = new ProjectService()
  const projectList = await projectService.allProjectList({
    page,
    limit,
    sortBy,
    sortType,
    ...(search !== undefined ? { search } : {}),
  });

  res.status(200).json(new apiResponse(projectList, 'Success'))

});
