import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { RestrictTo } from "../../../shared/restricet-to.js";
import { addNewProjectController } from "../controller/addNewProject.controller.js";
import { UpdateProjectController } from "../controller/update-project.controller.js";

const projectRouter = Router();

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
  UpdateProjectController
);

export { projectRouter };
