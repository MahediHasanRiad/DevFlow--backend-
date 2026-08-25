import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { RestrictTo } from "../../../shared/restricet-to.js";
import { addNewProjectController } from "../controller/addNewProject.controller.js";

const projectRouter = Router()

projectRouter.post('/add-new-project', authVerify, RestrictTo('PROJECT_MANAGER'), addNewProjectController)



export {projectRouter}