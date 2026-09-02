import { Router } from "express";
import { createOrganizationController } from "../controller/create-organization.controller.js";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { updateOrganizationController } from "../controller/update-organization.controller.js";
import { getOrganizationController } from "../controller/find-a-organization.controller.js";
import { deleteOrganizationController } from "../controller/delete-organization.controller.js";
import { getAllOrganizationsController } from "../controller/list-of-all-organization.controller.js";

const organizationRouter = Router();

organizationRouter.get(
  "/list-of-all-organizations",
  authVerify,
  getAllOrganizationsController,
);
organizationRouter.post("/create", authVerify, createOrganizationController);
organizationRouter.patch(
  "/update/:organizationId",
  authVerify,
  updateOrganizationController,
);
organizationRouter.get(
  "/:organizationId", 
  authVerify,
  getOrganizationController,
);
organizationRouter.delete(
  "/:organizationId",
  authVerify,
  deleteOrganizationController,
);


export { organizationRouter };
