import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { createRoleController } from "../controller/create-role.controller.js";


const roleAndPermissionRouter = Router()

roleAndPermissionRouter.post('/create-a-role', authVerify, createRoleController)



export {roleAndPermissionRouter}