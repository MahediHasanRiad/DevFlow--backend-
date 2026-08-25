import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { TeamMemberService } from "../service/team-member.service.js";

export const DeleteTeamMemberController = asyncHandler(async (req, res) => {
  const memberId = req.params.memberId as string;

  if (!memberId) throw new ApiErrorHandler(404, "member id required");

  // find team member
  const teamMemberService = new TeamMemberService();
  await teamMemberService.deleteTeamMember(memberId);

  res.status(200).json(new apiResponse(null, "Success"));
});
