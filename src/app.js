import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import rutinasRoutes from "./routes/rutina.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";
import dietRoutes from "./routes/dieta.routes.js";

dotenv.config();

const app = express();

// Configuración de CORS
const allowedOrigins = [
    'http://localhost:8080',
    'https://www.jobsyfitness.com',
    'https://67e9996406dcdc7b904ff8c8--jocular-kashata-4fa45c.netlify.app',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Permitir el origen
        } else {
            callback(new Error('Not allowed by CORS')); // Bloquear el origen
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middleware de CORS
app.use(cors(corsOptions));

// Manejo de solicitudes preflight (OPTIONS)
app.options('*', cors(corsOptions));

// Middleware para registrar solicitudes entrantes (Depuración)
app.use((req, res, next) => {
    console.log('--- Incoming Request ---');
    console.log('Origin:', req.headers.origin);
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    next();
});

// Otros middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api", authRoutes);
app.use("/api", rutinasRoutes);
app.use("/api", trainerRoutes);
app.use("/api", clienteRoutes);
app.use("/api", dietRoutes);

export default app;
