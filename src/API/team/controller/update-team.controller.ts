import redis from "../../../config/redis.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { OrganizationMemberService } from "../../organization-member/service/organization-member.service.js";
import { UpdateTeamInputSchema } from "../schema/team.schema.js";
import { TeamService } from "../service/team.service.js";

export const UpdateTeamController = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  if (!userId) throw new ApiErrorHandler(401, "Unauthorized");

  const teamService = new TeamService();
  const organizationMemberService = new OrganizationMemberService();

  const teamId = req.params.teamId as string;
  if (!teamId) throw new ApiErrorHandler(404, "Team id required");

  // check team exist or not
  const findTeam = await teamService.findATeamById(teamId);
  if (!findTeam) throw new ApiErrorHandler(404, "Team not found");

  if (!findTeam.organizationId) {
    throw new ApiErrorHandler(
      400,
      "Team is not associated with an organization",
    );
  }

  // check organization member
  const member = await organizationMemberService.findOrganizationMemberByUserId(
    {
      userId: userId,
      organizationId: findTeam.organizationId,
    },
  );

  // verification
  if (!member) throw new ApiErrorHandler(404, "Member not found");

  // permission
  if (member.role !== "ADMIN" && member.role !== "PROJECT_MANAGER")
    throw new ApiErrorHandler(403, "You are not allowed to update this team");

  const { name, description } = UpdateTeamInputSchema.parse(req.body);

  const updatedData: { name?: string; description?: string } = {};
  if (name !== undefined) updatedData.name = name;
  if (description !== undefined && description !== null)
    updatedData.description = description;

  const id = findTeam?.id;
  const team = await teamService.updateTeam({ id, updatedData }); // update team

  // delete cash
  await redis.del(`teams:${findTeam.organizationId}:`)

  res.status(200).json(new apiResponse(team, "Successfully Updated !!!"));
});
