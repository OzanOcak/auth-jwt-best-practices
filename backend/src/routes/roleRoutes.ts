import { Router } from "express";

import { authenticate } from "../middleware/authenticateUser";
import { checkPermissionsToAuthorize } from "../middleware/authorizeUser";
import { user } from "../controllers/roleControllers/userController";
import { editor } from "../controllers/roleControllers/editorController";
import { admin } from "../controllers/roleControllers/adminController";
import { deleteUserProfile } from "../controllers/featureControllers/deleteUserProfile";
import { updateUserRole } from "../controllers/featureControllers/updateUserRole";

const router = Router();

// user route
router.get(
  "/profile",
  authenticate,
  checkPermissionsToAuthorize("view_profile"),
  user
);

// editor routes
router.get(
  "/editor",
  authenticate,
  checkPermissionsToAuthorize("view_profile", "view_users"),
  editor
);

// admin routes
router.get(
  "/admin",
  authenticate,
  checkPermissionsToAuthorize(
    "view_profile",
    "view_users",
    "edit_user_role",
    "delete_user"
  ),
  admin
);

router.delete(
  "/admin/:userId",
  authenticate,
  checkPermissionsToAuthorize("delete_user"),
  deleteUserProfile
);
router.patch(
  "/admin/:userId/role",
  authenticate,
  checkPermissionsToAuthorize("edit_user_role"),
  updateUserRole
);

export default router;
