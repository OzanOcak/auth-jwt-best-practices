import { Router } from "express";

import { authenticate } from "../middleware/authenticateUser";
import { validateUser } from "../middleware/validateUser";
import { register } from "../controllers/authControllers/registerUser";
import { login } from "../controllers/authControllers/loginUser";
import { getAccessToken } from "../controllers/authControllers/refreshAccessToken";
import { logout } from "../controllers/authControllers/logoutUser";
import { verifyOTP } from "../controllers/authControllers/verifyOTP";

const router = Router();

router.post("/verify-otp", verifyOTP);
router.post("/signup", validateUser, register);
router.post("/login", login);
router.post("/refresh", getAccessToken);
router.post("/logout", authenticate, logout);

export default router;
