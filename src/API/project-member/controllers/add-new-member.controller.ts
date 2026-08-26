import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ApiErrorHandler } from "../../../shared/apiErrorHandler.js";
import { createProjectMemberSchema } from "../schema/projectMember.schema.js";
import { ProjectService } from "../../project/service/project.service.js";
import { UserService } from "../../user/service/user.service.js";
import { ProjectMemberService } from "../service/project-member.service.js";
import { apiResponse } from "../../../shared/apiResponseHandler.js";
import { TeamMemberService } from "../../team-member/service/team-member.service.js";

export const addNewMemberController = asyncHandler(async (req, res) => {
  const user_Id = req.user?.id as string;
  if (!user_Id) throw new ApiErrorHandler(401, "Unauthorized");

  const { projectId, userId, responsibility } = createProjectMemberSchema.parse(
    req.body,
  );

  const projectService = new ProjectService();
  const userService = new UserService();
  const projectMemberService = new ProjectMemberService();
  const teamMemberService = new TeamMemberService();

  const project = projectService.findAProjectById(projectId);
  if (!project) throw new ApiErrorHandler(404, "Project not found");

  const user = userService.findUserById(userId);
  if (!user) throw new ApiErrorHandler(404, "User not found");

  const existMember = await projectMemberService.ExistProjectMember({projectId, userId})
  if(existMember) throw new ApiErrorHandler(400, 'User Already exist in this Project')

  // verification
  const isMember = await teamMemberService.userExistThisTeam({
    teamId: (await project).teamId,
    userId,
  });
  console.log("member", isMember, userId);
  if (!isMember)
    throw new ApiErrorHandler(403, "Only Existing Project Member can Add !!!");
  
  
  // create
  const projectMember = await projectMemberService.AddNewProjectMember({
    projectId,
    userId,
    responsibility,
  });

  res
    .status(201)
    .json(new apiResponse(projectMember, "Successfully Created !!!"));
});
