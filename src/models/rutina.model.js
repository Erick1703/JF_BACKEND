import mongoose from "mongoose"

const rutinaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' },
    descripcion: String,
    videos: [{
      url: String,
      repeticiones: Number,
      set: Number,
      ejercicio: String,
      orden: Number
    }],
  
})

export default mongoose.model("Rutina", rutinaSchema)