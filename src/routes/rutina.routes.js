import { Router } from "express";
import { getAllRutinas,createRutina, updateRutina, deleteRutina, getRutinaById,getRoutinesByTrainer, getClientRoutines, removeRoutineFromClient, assignMultipleRoutinesToClient } from "../controllers/rutina.controller.js";
import { protectRoute } from '../middlewares/validate.js';
const router = Router();

//obtener todas las rutinas
router.get("/rutinas",protectRoute(['trainer','client']), getAllRutinas)

//obtener una rutina por id
router.get("/rutinas/:id",protectRoute(['trainer', 'client']),getRutinaById )

//agregar rutinas
router.post("/add-rutinas", createRutina)

//actualizar rutinas
router.put("/update-rutinas/:id",updateRutina )

//eliminar rutinas
router.delete("/delete-rutinas/:id",protectRoute(['trainer']), deleteRutina)

router.get('/trainer/:trainerId/rutinas',protectRoute(['trainer']), getRoutinesByTrainer);

router.post('/clients/assign-multiple-routines',protectRoute(['trainer']), assignMultipleRoutinesToClient);

router.get('/clients/:clientId/routines',protectRoute(['client']), getClientRoutines);


// Eliminar una rutina solo de un cliente
router.delete('/clients/:clientId/routines/:routineId',protectRoute(['trainer']), removeRoutineFromClient);
export default router;