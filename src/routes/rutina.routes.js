import { Router } from "express";
import { getAllRutinas,createRutina, updateRutina, deleteRutina, getRutinaById,getRoutinesByTrainer, getClientRoutines, removeRoutineFromClient, assignMultipleRoutinesToClient } from "../controllers/rutina.controller.js";
import { protectRoute } from '../middlewares/validate.js';
const router = Router();

//obtener todas las rutinas
router.get("/rutinas", getAllRutinas)

//obtener una rutina por id
router.get("/rutinas/:id",getRutinaById )

//agregar rutinas
router.post("/add-rutinas",protectRoute(['trainer']), createRutina)

//actualizar rutinas
router.put("/update-rutinas/:id",protectRoute(['trainer']),updateRutina )

//eliminar rutinas
router.delete("/delete-rutinas/:id",protectRoute(['trainer']), deleteRutina)

router.get('/trainer/:trainerId/rutinas', getRoutinesByTrainer);

router.post('/clients/assign-multiple-routines', assignMultipleRoutinesToClient);

router.get('/clients/:clientId/routines', getClientRoutines);


// Eliminar una rutina solo de un cliente
router.delete('/clients/:clientId/routines/:routineId', removeRoutineFromClient);
export default router;