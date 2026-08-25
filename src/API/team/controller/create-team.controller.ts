import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { CreateTeamInputSchema } from "../schema/team.schema.js";
import { TeamService } from "../service/team.service.js";

export const createTeamController = asyncHandler(async (req, res) => {

  const { name, description, createdById } = CreateTeamInputSchema.parse(req.body);

  const teamService = new TeamService();

  const addTeam = await teamService.addNewTeam({
    name,
    description,
    createdById,
  });

  res
    .status(201)
    .json(new apiResponse(addTeam, "successfully create a new Team"));
});
