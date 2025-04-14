import { Router } from "express";
import { activarCliente, desactivarCliente } from "../controllers/cliente.controller.js";
import { protectRoute } from '../middlewares/validate.js';
const router = Router();

router.put('/activar-cliente/:id', activarCliente);
router.put('/desactivar-cliente/:id', desactivarCliente);

export default router;