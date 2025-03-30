import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import rutinasRoutes from "./routes/rutina.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import dietRoutes from "./routes/dieta.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configuración de CORS
const allowedOrigins = [
  'https://jocular-kashata-4fa45c.netlify.app', // Origen base sin hash
  'https://67e9996406dcdc7b904ff8c8--jocular-kashata-4fa45c.netlify.app', // Origen dinámico con hash
  'http://localhost:8080', // Para desarrollo local
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (por ejemplo, desde cURL o Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", rutinasRoutes);
app.use("/api", trainerRoutes);
app.use("/api", clienteRoutes);
app.use("/api", dietRoutes);
app.use(cookieParser());

export default app;