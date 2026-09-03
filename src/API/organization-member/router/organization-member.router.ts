import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { addNewMembersController } from "../controller/add-new-member.controller.js";

const organizationMemberRouter = Router()

organizationMemberRouter.post('/add-new-member', authVerify, addNewMembersController)
organizationMemberRouter.post('/:memberId', authVerify, )

export {organizationMemberRouter}