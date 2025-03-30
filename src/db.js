import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar las variables de entorno del archivo .env
dotenv.config();

export const connectDB = async () => {
  try {
    // Usar la variable de entorno DB_URI
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};