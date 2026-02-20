import {
  createConstituencyController,
  deleteConstituencyController,
  editConstituencyController,
  getAllConstituencyWithPaginationController,
} from "@/controllers/AdminController";
import { Router } from "express";

import { requireAuth } from "@/middlewares/AuthMiddleware";

const router = Router();

router.get(
  "/constituencies",
  requireAuth,
  getAllConstituencyWithPaginationController,
);

router.post("/constituencies", requireAuth, createConstituencyController);
router.delete("/constituencies/:id", requireAuth, deleteConstituencyController);
router.put("/constituencies/:id", requireAuth, editConstituencyController);

export default router;
