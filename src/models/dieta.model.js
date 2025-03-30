import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  calories: { type: Number, required: true, min: 0 },
  fat: { type: Number, required: true, min: 0, default: 0 },
  protein: { type: Number, required: true, min: 0, default: 0 },
  carbs: { type: Number, required: true, min: 0, default: 0 },
  quantity: {
    amount: { type: Number, default: 1 }, // Cantidad numérica
    unit: {
      type: String,
      enum: ["gr", "ml", "litro", "scoop", "unidad", "oz"], // Unidades permitidas
      default: "gr",
    },
  },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
}, { _id: true, timestamps: true });

mealSchema.virtual("isCompleted").get(function () {
  if (!this.completed || !this.completedAt) return false;
  const now = new Date();
  const twelveHoursInMs = 12 * 60 * 60 * 1000;
  return now - this.completedAt < twelveHoursInMs;
});

mealSchema.set("toJSON", { virtuals: true });
mealSchema.set("toObject", { virtuals: true });

const dietSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  clientIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cliente" }],
  calorieGoal: { type: Number, required: true, min: 0, default: 2000 },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
  meals: {
    Lunes: { Desayuno: [mealSchema], Almuerzo: [mealSchema], Merienda: [mealSchema], Cena: [mealSchema], Extras: [mealSchema] },
    Martes: { Desayuno: [mealSchema], Almuerzo: [mealSchema], Merienda: [mealSchema], Cena: [mealSchema], Extras: [mealSchema] },
    Miércoles: { Desayuno: [mealSchema], Almuerzo: [mealSchema], Merienda: [mealSchema], Cena: [mealSchema], Extras: [mealSchema] },
    Jueves: { Desayuno: [mealSchema], Almuerzo: [mealSchema], Merienda: [mealSchema], Cena: [mealSchema], Extras: [mealSchema] },
    Viernes: { Desayuno: [mealSchema], Almuerzo: [mealSchema], Merienda: [mealSchema], Cena: [mealSchema], Extras: [mealSchema] },
    Sábado: { Desayuno: [mealSchema], Almuerzo: [mealSchema], Merienda: [mealSchema], Cena: [mealSchema], Extras: [mealSchema] },
    Domingo: { Desayuno: [mealSchema], Almuerzo: [mealSchema], Merienda: [mealSchema], Cena: [mealSchema], Extras: [mealSchema] },
  },
}, { timestamps: true });

export default mongoose.model("Diet", dietSchema);