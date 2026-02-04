import { Router } from "express";
import { registerController, loginController } from "../controllers/AuthController";


const router = Router();

// POST /auth/register
router.post("/register", registerController);

// POST /auth/login
router.post("/login", loginController);


export default router;
