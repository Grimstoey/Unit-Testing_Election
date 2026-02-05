import { Router } from "express";
import { registerController, loginController } from "../controllers/AuthController";
import { requireAuth } from "@/middlewares/AuthMiddleware";
import { meController } from "@/controllers/AuthController";


const router = Router();

// POST /auth/register
router.post("/register", registerController);

// POST /auth/login
router.post("/login", loginController);

// GET /auth/me
router.get("/me" , requireAuth ,meController)


export default router;
