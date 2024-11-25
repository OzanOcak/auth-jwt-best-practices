import { Router } from "express";

import { authenticate } from "../middleware/authenticateUser";
import { validateUser } from "../middleware/validateUser";
import { register } from "../controllers/authControllers/registerUser";
import { login } from "../controllers/authControllers/loginUser";
import { getAccessToken } from "../controllers/authControllers/refreshAccessToken";
import { logout } from "../controllers/authControllers/logoutUser";

const router = Router();

router.post("/signup", validateUser, register); //  security, avoid x
router.post("/login", login);
router.post("/refresh", getAccessToken);
router.post("/logout", authenticate, logout);

export default router;
