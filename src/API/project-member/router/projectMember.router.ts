import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { addNewMemberController } from "../controllers/add-new-member.controller.js";
import { ListOfProjectsByProjectController } from "../controllers/list-of-members-by-project.controller.js";
import { updateProjectMemberController } from "../controllers/update-project-member.controller.js";

const projectMemberRouter = Router();


projectMemberRouter.post('/add-new-member', authVerify, addNewMemberController) 
projectMemberRouter.patch('/update-project-member-info/:memberId', authVerify, updateProjectMemberController) 
projectMemberRouter.get('/all-members-by-project/:projectId', authVerify, ListOfProjectsByProjectController) 

export {projectMemberRouter};
