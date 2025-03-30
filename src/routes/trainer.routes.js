import { Router } from "express";
import { getTrainerClients } from "../controllers/trainer.controller.js";
const router = Router();

router.get("/trainers/:trainerId/clients", getTrainerClients);

export default router;