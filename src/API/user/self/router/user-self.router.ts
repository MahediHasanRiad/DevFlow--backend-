import { Router } from "express";
import { authVerify } from "../../../../middleware/auth.middleware.js";
import { MyProfileController } from "../controller/my-profile.controller.js";
import { FindAUserController } from "../controller/find-a-user.controller.js";
import { UpdateUserProfileController } from "../controller/update-user-profile.controller.js";
import { upload } from "../../../../middleware/multer.middleware.js";
import { allUserListController } from "../controller/all-user-list.controller.js";
import { deleteAUserController } from "../controller/delete-user.controller.js";

const userSelfRouter = Router()

userSelfRouter.get('/list-of-all-users', allUserListController)
userSelfRouter.delete('/delete-user/:userId', deleteAUserController)
userSelfRouter.patch('/update-profile', authVerify, upload.single('avatar'), UpdateUserProfileController)
userSelfRouter.get('/my-profile', authVerify, MyProfileController)
userSelfRouter.get('/:userId',authVerify, FindAUserController)


export {userSelfRouter}