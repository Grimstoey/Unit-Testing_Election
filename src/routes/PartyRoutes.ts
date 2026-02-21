import {
    createPartyController, deletePartyController, editPartyController,
    findAllPartyController,
    getAllPartyWithPaginationController
} from '@/controllers/PartyController'
import { Router } from 'express'
import {requireAuth} from "@/middlewares/AuthMiddleware";
import {createConstituencyController} from "@/controllers/AdminController";
import {getConstituencyById} from "@/repositories/AdminRepository";
import {getPartyById} from "@/repositories/PartyRepository";

const router = Router()

router.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const event = await getPartyById(id);
    if (event) {
        res.json(event);
    } else {
        res.status(404).send("Event not found");
    }
});

// POST /auth/register
router.get('/',requireAuth, getAllPartyWithPaginationController)
router.post('/', requireAuth, createPartyController);
router.delete('/:id', requireAuth, deletePartyController)
router.put('/:id', requireAuth, editPartyController);

export default router