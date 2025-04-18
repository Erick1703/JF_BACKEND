import { Router } from "express";
import { getTrainerClients } from "../controllers/trainer.controller.js";
import { protectRoute } from '../middlewares/validate.js';
const router = Router();

router.get("/trainers/:trainerId/clients",protectRoute(['trainer']), getTrainerClients);

export default router;