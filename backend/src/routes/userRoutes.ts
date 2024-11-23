import { Router } from "express";

import { authenticate } from "../middleware/authenticateUser";
import { getUserProfile } from "../controller/profileController";
import { validateUser } from "../middleware/validateUser";
import { register } from "../controller/userControllers/registerUser";
import { login } from "../controller/userControllers/loginUser";
import { getAccessToken } from "../controller/userControllers/refreshAccessToken";
import { logout } from "../controller/userControllers/logoutUser";
import { checkPermissionsToAuthorize } from "../middleware/authorizeUser";
import {
  getAllUsers,
  updateUserRole,
} from "../controller/roleControllers/adminRoleController";

const router = Router();

router.post("/signup", validateUser, register); //  security, avoid x
router.post("/login", login);
router.post("/refresh", getAccessToken);
router.post("/logout", authenticate, logout);
// Use the profile controller
router.get(
  "/profile",
  authenticate,
  checkPermissionsToAuthorize("view_profile"),
  getUserProfile
);

// Admin routes
router.get(
  "/admin/users",
  authenticate,
  checkPermissionsToAuthorize("view_users"),
  getAllUsers
);
router.post(
  "/admin/users/update-role",
  authenticate,
  checkPermissionsToAuthorize("edit_user_roles"),
  updateUserRole
);

export default router;
