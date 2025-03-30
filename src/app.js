import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import rutinasRoutes from "./routes/rutina.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import dietRoutes from "./routes/dieta.routes.js";
const app = express();
import dotenv from "dotenv";
dotenv.config();
app.use(cors({
    origin:['http://localhost:8080' ,'https://www.jobsyfitness.com', 'https://67e997e36073b1000bed2fc8--jocular-kashata-4fa45c.netlify.app/'],
    credentials: true, 
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'], 
    allowedHeaders: ['Content-Type','Authorization'], 
  }));


app.use(morgan("dev"));


app.use(express.json());


app.use("/api",authRoutes)
app.use("/api",rutinasRoutes)
app.use("/api",trainerRoutes)
app.use("/api",clienteRoutes)
app.use("/api",dietRoutes)


app.use(cookieParser());


export default app;