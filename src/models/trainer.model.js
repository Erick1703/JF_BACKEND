import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  telefono: { type: String, required: true },
  clientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }]
  // clientes: [{
  //   _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },  // Referencia al modelo Cliente
  //   nombre: String,
  //   apellido: String,
  //   email: String,
    
  // }]
}, { timestamps: true });

export default mongoose.model("Trainer", trainerSchema);