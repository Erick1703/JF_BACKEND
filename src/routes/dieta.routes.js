import express from "express";
import {
  createDiet,
  getDiets,
  getDietById,
  updateDiet,
  deleteDiet,
  assignDietToClient,
  removeDietFromClient,
  addMealToDiet,
  getTrainerDiets, // Nueva ruta
  getClientsByDietId, 
  getClientDiet,
  deleteMealFromDiet
} from "../controllers/dieta.controller.js";
import { protectRoute } from '../middlewares/validate.js';
const router = express.Router();

// CRUD para Diet
router.post("/diets", createDiet);
router.get("/diets", getDiets);
router.put("/diets/:id", updateDiet);
router.get("/diets/:id", getDietById);
router.delete("/diets/:id", deleteDiet);

// Rutas para asignación y eliminación de dietas en Cliente
router.post("/diets/:dietId/assign-to-client/:clientId", assignDietToClient);
router.delete("/diets/:dietId/remove-from-client/:clientId", removeDietFromClient);

// Nueva ruta para añadir comidas
router.post("/diets/:dietId/meals", addMealToDiet);

// Nueva ruta para obtener dietas del entrenador (corregida)
router.get("/diets/trainer/:trainerId", getTrainerDiets);
router.get("/:dietId/clients", getClientsByDietId);
router.get("/:clientId/diet", getClientDiet);
router.delete("/diets/:dietId/meals", deleteMealFromDiet);
export default router;