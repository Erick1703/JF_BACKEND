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
router.post("/diets",protectRoute(['trainer']), createDiet);
router.get("/diets",protectRoute(['client']), getDiets);
router.put("/diets/:id",protectRoute(['trainer']), updateDiet);
router.get("/diets/:id",protectRoute(['trainer', 'client']), getDietById);
router.delete("/diets/:id",protectRoute(['trainer']), deleteDiet);

// Rutas para asignación y eliminación de dietas en Cliente
router.post("/diets/:dietId/assign-to-client/:clientId",protectRoute(['trainer']), assignDietToClient);
router.delete("/diets/:dietId/remove-from-client/:clientId",protectRoute(['trainer']), removeDietFromClient);

// Nueva ruta para añadir comidas
router.post("/diets/:dietId/meals",protectRoute(['trainer']), addMealToDiet);

// Nueva ruta para obtener dietas del entrenador (corregida)
router.get("/diets/trainer/:trainerId",protectRoute(['trainer']), getTrainerDiets);
router.get("/:dietId/clients",protectRoute(['trainer']), getClientsByDietId);
router.get("/:clientId/diet",protectRoute(['trainer', 'client']), getClientDiet);
router.delete("/diets/:dietId/meals",protectRoute(['trainer']), deleteMealFromDiet);
export default router;