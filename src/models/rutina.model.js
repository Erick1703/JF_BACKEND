import mongoose from "mongoose"

const rutinaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
  descripcion: String,
  sets: [{
    tipo: { 
      type: String, 
      enum: ['normal', 'superserie', 'serie_compuesta'], 
      default: 'normal' 
    },
    orden: { type: Number, required: true },
    ejercicios: [{
      url: String,
      repeticiones: Number,
      set: Number, // Número de set dentro de la superserie/serie compuesta, si aplica
      ejercicio: String,
      orden: Number // Orden del ejercicio dentro del set
    }]
  }]
});

export default mongoose.model("Rutina", rutinaSchema)