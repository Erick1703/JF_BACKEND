import Diet from "../models/dieta.model.js";
import Cliente from "../models/cliente.model.js";
import mongoose from "mongoose";
// Crear una dieta
export const createDiet = async (req, res) => {
  try {
    const { name, calorieGoal, trainerId } = req.body;
    if (!trainerId) {
      return res.status(400).json({ message: "El ID del entrenador es obligatorio" });
    }

    const diet = new Diet({
      name,
      calorieGoal: calorieGoal || 2000,
      trainer: trainerId,
      clientIds: [],
    });
    await diet.save();
    res.status(201).json(diet);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la dieta", error });
  }
};

// Obtener todas las dietas
export const getDiets = async (req, res) => {
  try {
    const diets = await Diet.find()
      .populate("clientIds", "nombre apellido email")
      .populate("trainer", "name email");
    res.json(diets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las dietas", error });
  }
};

// Obtener una dieta por ID
export const getDietById = async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id)
      .populate("clientIds", "nombre apellido email")
      .populate("trainer", "name email");
    if (!diet) return res.status(404).json({ message: "Dieta no encontrada" });
    res.json(diet);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la dieta", error });
  }
};

// Actualizar una dieta
export const updateDiet = async (req, res) => {
  try {
    const { name, calorieGoal, meals } = req.body;
    const diet = await Diet.findByIdAndUpdate(
      req.params.id,
      { name, calorieGoal, meals },
      { new: true, runValidators: true }
    );
    if (!diet) return res.status(404).json({ message: "Dieta no encontrada" });
    res.json(diet);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la dieta", error });
  }
};

// Eliminar una dieta
export const deleteDiet = async (req, res) => {
  try {
    const diet = await Diet.findByIdAndDelete(req.params.id);
    if (!diet) return res.status(404).json({ message: "Dieta no encontrada" });

    await Cliente.updateMany({ diet: diet._id }, { $set: { diet: null } });
    res.json({ message: "Dieta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la dieta", error });
  }
};

// Asignar una dieta a un cliente
export const assignDietToClient = async (req, res) => {
  try {
    const { dietId, clientId } = req.params;

    const diet = await Diet.findById(dietId);
    if (!diet) return res.status(404).json({ message: "Dieta no encontrada" });

    const client = await Cliente.findById(clientId);
    if (!client) return res.status(404).json({ message: "Cliente no encontrado" });

    client.diet = dietId;
    await client.save();

    if (!diet.clientIds.includes(clientId)) {
      diet.clientIds.push(clientId);
      await diet.save();
    }

    res.json({ message: "Dieta asignada al cliente correctamente", client, diet });
  } catch (error) {
    res.status(500).json({ message: "Error al asignar la dieta", error });
  }
};

// Eliminar una dieta del campo diet de un cliente
export const removeDietFromClient = async (req, res) => {
  try {
    const { clientId, dietId } = req.params;

    const client = await Cliente.findById(clientId);
    if (!client) return res.status(404).json({ message: "Cliente no encontrado" });

    if (client.diet?.toString() !== dietId) {
      return res.status(400).json({ message: "El cliente no tiene asignada esta dieta" });
    }

    client.diet = null;
    await client.save();

    const diet = await Diet.findById(dietId);
    if (diet) {
      diet.clientIds = diet.clientIds.filter((id) => id.toString() !== clientId.toString());
      await diet.save();
    }

    res.json({ message: "Dieta eliminada del cliente correctamente", client });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la dieta del cliente", error });
  }
};

// Añadir una comida a una dieta
export const addMealToDiet = async (req, res) => {
  try {
    const { dietId } = req.params;
    const { day, category, name, calories, fat, protein, carbs, quantity } = req.body;

    const diet = await Diet.findById(dietId);
    if (!diet) {
      return res.status(404).json({ message: "Dieta no encontrada" });
    }

    const meal = {
      name,
      calories,
      fat: fat || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      quantity: {
        amount: quantity?.amount || 1, // Valor por defecto si no se envía
        unit: quantity?.unit || "gr",  // Valor por defecto si no se envía
      },
      completed: false,
      completedAt: null,
    };

    // Acceder a la estructura anidada directamente (no es un Map)
    diet.meals[day][category].push(meal);
    await diet.save();

    res.json(diet);
  } catch (error) {
    res.status(500).json({ message: "Error al añadir la comida", error });
  }
};

// Obtener todas las dietas del entrenador
export const getTrainerDiets = async (req, res) => {
  try {
    const { trainerId } = req.params;
    if (!trainerId) {
      return res.status(400).json({ message: "El ID del entrenador es obligatorio" });
    }

    const diets = await Diet.find({ trainer: trainerId })
      .populate("clientIds", "nombre apellido email")
      .populate("trainer", "name email");
    res.json(diets);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las dietas del entrenador", error });
  }
};


export const getClientsByDietId = async (req, res) => {
  try {
    const { dietId } = req.params;

    if (!dietId) {
      return res.status(400).json({ message: "Se requiere un ID de dieta" });
    }

    // Buscar la dieta para obtener los clientIds
    const diet = await Diet.findById(dietId).select("clientIds");
    if (!diet) {
      return res.status(404).json({ message: "Dieta no encontrada" });
    }

    // Si no hay clientes asignados, devolver una lista vacía
    if (!diet.clientIds || diet.clientIds.length === 0) {
      return res.status(200).json({ clients: [] });
    }

    // Buscar los clientes cuyos IDs están en clientIds
    const clients = await Cliente.find({ _id: { $in: diet.clientIds } })
      .select("nombre apellido email telefono _id")
      .lean();

    res.status(200).json({ clients });
  } catch (error) {
    console.error("Error al buscar clientes por dietId:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// Controlador para obtener la dieta asignada a un cliente
export const getClientDiet = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    // Buscar el cliente y poblar la dieta
    const client = await Cliente.findById(clientId).populate("diet");
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Verificar si el cliente tiene una dieta asignada
    if (!client.diet) {
      return res.status(200).json({
        message: "El cliente no tiene una dieta asignada",
        data: null,
      });
    }

    // Devolver la dieta asignada
    res.status(200).json({
      message: "Dieta obtenida exitosamente",
      data: client.diet,
    });
  } catch (error) {
    console.error("Error al obtener la dieta del cliente:", error);
    res.status(500).json({ message: "Error al obtener la dieta", error: error.message });
  }
};
export const deleteMealFromDiet = async (req, res) => {
  try {
    const { dietId } = req.params; // ID de la dieta
    const { day, mealType, mealId } = req.body; // Día, tipo de comida y ID de la comida a eliminar

    // Validar parámetros
    if (!dietId || !day || !mealType || !mealId) {
      return res.status(400).json({ message: "Faltan parámetros: dietId, day, mealType o mealId" });
    }

    // Validar que el día y el tipo de comida sean válidos
    const validDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const validMealTypes = ["Desayuno", "Almuerzo", "Merienda", "Cena", "Extras"];
    if (!validDays.includes(day)) {
      return res.status(400).json({ message: `Día inválido: ${day}. Debe ser uno de ${validDays.join(", ")}` });
    }
    if (!validMealTypes.includes(mealType)) {
      return res.status(400).json({ message: `Tipo de comida inválido: ${mealType}. Debe ser uno de ${validMealTypes.join(", ")}` });
    }

    // Verificar que el ID de la dieta y el mealId sean válidos ObjectId
    if (!mongoose.Types.ObjectId.isValid(dietId) || !mongoose.Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({ message: "dietId o mealId no son ObjectId válidos" });
    }

    // Buscar la dieta por ID (sin verificar entrenador)
    const diet = await Diet.findById(dietId);
    if (!diet) {
      return res.status(404).json({ message: "Dieta no encontrada" });
    }

    // Acceder al arreglo de comidas del día y tipo especificados
    const mealsArray = diet.meals[day][mealType];
    if (!mealsArray || mealsArray.length === 0) {
      return res.status(404).json({ message: `No hay comidas en ${day}.${mealType}` });
    }

    // Buscar el índice de la comida con el mealId
    const mealIndex = mealsArray.findIndex(meal => meal._id.toString() === mealId);
    if (mealIndex === -1) {
      return res.status(404).json({ message: `Comida con ID ${mealId} no encontrada en ${day}.${mealType}` });
    }

    // Eliminar la comida del arreglo
    mealsArray.splice(mealIndex, 1);

    // Guardar los cambios en la dieta
    await diet.save();

    res.status(200).json({
      message: `Comida eliminada exitosamente de ${day}.${mealType}`,
      diet,
    });
  } catch (error) {
    console.error("Error al eliminar comida de la dieta:", error);
    res.status(500).json({ message: "Error al eliminar la comida", error: error.message });
  }
};