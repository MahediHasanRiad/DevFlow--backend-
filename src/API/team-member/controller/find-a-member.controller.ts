import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamService } from "../../team/service/team.service.js";
import { TeamMemberService } from "../service/team-member.service.js";

export const FindAMemberController = asyncHandler(async (req, res) => {
  const memberId = req.params.memberId as string;

  if (!memberId) throw new ApiErrorHandler(404, "member id required");

  // find team member
  const teamMemberService = new TeamMemberService();
  const teamMember = await teamMemberService.findTeamMember(memberId);
  if (!teamMember) throw new ApiErrorHandler(404, "Team Member not found !!!");

  res.status(200).json(new apiResponse(teamMember, "Success"));
});
