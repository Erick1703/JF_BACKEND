import { Router } from "express";
import {registerClient, registerTrainer, loginCliente, loginTrainer, logout} from "../controllers/auth.controller.js";
import { authorizeRole } from "../middlewares/validate.js";
const router = Router();
//clientes
router.post("/register-client", registerClient)
router.post("/login-client", loginCliente)



//entrenadores
router.post("/register-trainer",registerTrainer)
router.post("/login-trainer", loginTrainer)


router.post("/logout",logout)




export default router;