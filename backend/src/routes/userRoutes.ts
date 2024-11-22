import { Router } from "express";

import { authenticate } from "../middleware/authenticateUser";
import { getUserProfile } from "../controller/profileController";
import { validateUser } from "../middleware/validateUser";
import { register } from "../controller/userControllers/registerUser";
import { login } from "../controller/userControllers/loginUser";
import { getAccessToken } from "../controller/userControllers/refreshAccessToken";
import { logout } from "../controller/userControllers/logoutUser";

const router = Router();

router.post("/signup", validateUser, register); //  security, avoid x
router.post("/login", login);
router.post("/refresh", getAccessToken);
router.post("/logout", authenticate, logout);
// Use the profile controller
router.get("/profile", authenticate, getUserProfile);

export default router;
