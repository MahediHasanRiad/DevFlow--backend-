import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { RestrictTo } from "../../../shared/restricet-to.js";
import { addTeamMemberController } from "../controller/add-member.controller.js";
import { UpdateTeamMemberController } from "../controller/update-member.controller.js";
import { FindAMemberController } from "../controller/find-a-member.controller.js";
import { DeleteTeamMemberController } from "../controller/delete-a-team-member.controller.js";
import { listOfAllMemberByTeamController } from "../controller/list-of-all-member-by-team.controller.js";

const teamMemberRouter = Router();

teamMemberRouter.get(
  "/list-of-member-by-team/:teamId",
  authVerify,
  listOfAllMemberByTeamController
);
teamMemberRouter.post(
  "/add-team-member",
  authVerify,
  RestrictTo("EMPLOYEE", "PROJECT_MANAGER"),
  addTeamMemberController,
);
teamMemberRouter.patch(
  "/update-team-member/:memberId",
  authVerify,
  RestrictTo("EMPLOYEE", "PROJECT_MANAGER"),
  UpdateTeamMemberController
);
teamMemberRouter.get(
  "/find-team-member/:memberId",
  authVerify,
  FindAMemberController
);
teamMemberRouter.delete(
  "/delete-team-member/:memberId",
  authVerify,
  DeleteTeamMemberController
);

export { teamMemberRouter };
