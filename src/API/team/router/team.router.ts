import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createTeamController } from "../controller/create-team.controller.js";
import { UpdateTeamController } from "../controller/update-team.controller.js";
import { FindATeamController } from "../controller/find-a-team.controller.js";
import { DeleteATeamController } from "../controller/delete-a-team.controller.js";
import { TeamListController } from "../controller/team-lists.controller.js";

const teamRouter = Router();

teamRouter.get("/team-lists/:orgId", authVerify, TeamListController);
teamRouter.post(
  "/add-new-team",
  authVerify,
  createTeamController,
);
teamRouter.patch(
  "/update-team/:teamId",
  authVerify,
  UpdateTeamController,
);
teamRouter.get("/get-a-team/:teamId", authVerify, FindATeamController);
teamRouter.delete(
  "/delete-a-team/:teamId",
  authVerify,
  DeleteATeamController,
);

export { teamRouter };
