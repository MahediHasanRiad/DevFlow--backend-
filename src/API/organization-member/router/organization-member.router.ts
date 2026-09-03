import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { addNewMembersController } from "../controller/add-new-member.controller.js";
import { FindAOrganizationMemberController } from "../controller/find-a-organization-member.controller.js";
import { updateMemberController } from "../controller/update-organization.controller.js";
import { deleteOrganizationMemberController } from "../controller/delete-a-member.controller.js";


const organizationMemberRouter = Router()

organizationMemberRouter.post('/add-new-member', authVerify, addNewMembersController)
organizationMemberRouter.get('/:memberId', authVerify, FindAOrganizationMemberController)
organizationMemberRouter.patch('/:memberId', authVerify, updateMemberController)
organizationMemberRouter.delete('/:memberId', authVerify, deleteOrganizationMemberController)

export {organizationMemberRouter}