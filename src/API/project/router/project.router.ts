import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { RestrictTo } from "../../../shared/restricet-to.js";
import { addNewProjectController } from "../controller/addNewProject.controller.js";
import { UpdateProjectController } from "../controller/update-project.controller.js";
import { FindAProjectController } from "../controller/find-a-project.controller.js";
import { DeleteAProjectController } from "../controller/delete-a-project.controller.js";
import { allProjectsController } from "../controller/all-projects.controller.js";
import { allProjectsByTeamController } from "../controller/all-projects-by-team.controller.js";

const projectRouter = Router();

projectRouter.get(
  "/all-projects-by-team/:teamId",
  authVerify,
  allProjectsByTeamController,
);
projectRouter.get("/all-projects", authVerify, allProjectsController);
projectRouter.post(
  "/add-new-project",
  authVerify,
  RestrictTo("PROJECT_MANAGER"),
  addNewProjectController,
);
projectRouter.patch(
  "/update-a-project/:projectId",
  authVerify,
  RestrictTo("PROJECT_MANAGER", "ADMIN", "EMPLOYEE"),
  UpdateProjectController,
);
projectRouter.get(
  "/find-a-project/:projectId",
  authVerify,
  FindAProjectController,
);
projectRouter.delete(
  "/find-a-project/:projectId",
  authVerify,
  DeleteAProjectController,
);

export { projectRouter };
