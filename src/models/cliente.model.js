import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  telefono: { type: String, required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
routines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rutina', default: [] }], // Relación con la colección de Rutinas
diet: { type: mongoose.Schema.Types.ObjectId, ref: "Diet", default: null },
}, { timestamps: true });

export default mongoose.model("Cliente", clienteSchema);