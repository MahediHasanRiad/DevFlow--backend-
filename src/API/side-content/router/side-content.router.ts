import { Router } from "express";
import { authVerify } from "../../../middleware/auth.middleware.js";
import { RestrictTo } from "../../../shared/restricet-to.js";
import { FindPrivacyPolicyController, PrivacyPolicyController, UpdatePrivacyPolicyController } from "../controller/privacy-policy.controller.js";
import { createAboutUsController, FindAboutUsController, UpdateAboutUsController } from "../controller/about-us.controller.js";
import { FindTermsAndConditionController, termsAndConditionController, UpdateTermsAndConditionController } from "../controller/terms-condition.controller.js";

const sideContentRouter = Router();

sideContentRouter.get(
  "/side-content/privacy-policy/:privacyId",
  FindPrivacyPolicyController
);
sideContentRouter.post(
  "/side-content/privacy-policy",
  authVerify,
  RestrictTo("ADMIN"),
  PrivacyPolicyController,
);
sideContentRouter.patch(
  "/side-content/privacy-policy/:privacyId",
  authVerify,
  RestrictTo("ADMIN"),
  UpdatePrivacyPolicyController,
);

// about us
sideContentRouter.post(
  "/side-content/about-us",
  authVerify,
  RestrictTo("ADMIN"),
  createAboutUsController
);
sideContentRouter.post(
  "/side-content/about-us/:id",
  authVerify,
  RestrictTo("ADMIN"),
  UpdateAboutUsController,
);
sideContentRouter.get(
  "/side-content/about-us/:id",
  FindAboutUsController,
);

// terms and condition
sideContentRouter.post(
  "/side-content/terms-and-condition",
  authVerify,
  RestrictTo("ADMIN"),
  termsAndConditionController
);
sideContentRouter.post(
  "/side-content/terms-and-condition/:id",
  authVerify,
  RestrictTo("ADMIN"),
  UpdateTermsAndConditionController,
);
sideContentRouter.get(
  "/side-content/terms-and-condition/:id",
  FindTermsAndConditionController,
);


export { sideContentRouter };
