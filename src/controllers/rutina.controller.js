import Rutina from "../models/rutina.model.js";
import Client from "../models/cliente.model.js";
import mongoose from "mongoose";
export const createRutina = async (req, res) => {
  const { nombre, trainer, descripcion, videos } = req.body;

  try {
    const nuevaRutina = new Rutina({
      nombre,
      trainer,
      descripcion,
      videos,
      
    });

    const rutinaGuardada = await nuevaRutina.save();
    res.status(201).json({
      message: "Rutina creada exitosamente",
      data: rutinaGuardada,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la rutina", error: error.message });
  }
};


export const updateRutina = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, videos } = req.body;
  
    try {
      const rutinaActualizada = await Rutina.findByIdAndUpdate(
        id,
        { nombre, descripcion, videos },
        { new: true } // Retorna el documento actualizado
      );
  
      if (!rutinaActualizada) {
        return res.status(404).json({ message: "Rutina no encontrada" });
      }
  
      res.status(200).json({
        message: "Rutina actualizada exitosamente",
        data: rutinaActualizada,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar la rutina", error: error.message });
    }
  };

  
  export const deleteRutina = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Validar que el ID sea válido
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID de rutina inválido" });
      }
  
      // Eliminar la rutina
      const rutinaEliminada = await Rutina.findByIdAndDelete(id);
      if (!rutinaEliminada) {
        return res.status(404).json({ message: "Rutina no encontrada" });
      }
  
      // Actualizar todos los clientes que tienen esta rutina asignada
      await Client.updateMany(
        { routines: id }, // Buscar clientes que tengan esta rutina en su arreglo
        { $pull: { routines: id } } // Eliminar el ID de la rutina del arreglo
      );
  
      res.status(200).json({
        message: "Rutina eliminada exitosamente y desasignada de los clientes",
        data: rutinaEliminada,
      });
    } catch (error) {
      console.error('Error al eliminar la rutina:', error);
      res.status(500).json({ message: "Error al eliminar la rutina", error: error.message });
    }
  };


  export const getRutinaById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const rutina = await Rutina.findById(id)
  
      if (!rutina) {
        return res.status(404).json({ message: "Rutina no encontrada" });
      }
  
      res.status(200).json({
        message: "Rutina obtenida exitosamente",
        rutina: rutina,
      });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la rutina", error: error.message });
    }
  };
  
export const getAllRutinas = async (req, res) => {
  try {
    const rutinas = await Rutina.find();
    res.status(200).json({
      message: "Rutinas obtenidas exitosamente",
      rutinas: rutinas,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las rutinas", error: error.message });
  }
};



// Controlador para obtener todas las rutinas por trainerId
export const getRoutinesByTrainer = async (req, res) => {
  const { trainerId } = req.params; // Obtener el trainerId de los parámetros de la URL

  try {
    // Validar que trainerId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(trainerId)) {
      return res.status(400).json({ message: "ID del entrenador inválido" });
    }

    // Buscar todas las rutinas asociadas al trainerId
    const rutinas = await Rutina.find({ trainer: trainerId }).populate('trainer', 'nombre email'); // Opcional: poblar datos del entrenador

    if (!rutinas || rutinas.length === 0) {
      return res.status(404).json({ message: "No se encontraron rutinas para este entrenador" });
    }

    res.status(200).json({
      message: "Rutinas obtenidas exitosamente",
      data: rutinas,
    });
  } catch (error) {
    console.error('Error al obtener las rutinas:', error);
    res.status(500).json({ message: "Error al obtener las rutinas", error: error.message });
  }
};


export const assignMultipleRoutinesToClient = async (req, res) => {
  const { clientId, routineIds } = req.body;

  try {
    // Validar que clientId sea válido
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    // Validar que routineIds sea un arreglo y que todos los IDs sean válidos
    if (!Array.isArray(routineIds) || routineIds.length === 0 || !routineIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "El campo routineIds debe ser un arreglo de IDs válidos" });
    }

    // Buscar el cliente
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Asegurarse de que rutinas sea un arreglo (por si no está definido)
    if (!Array.isArray(client.routines)) {
      client.rutinas = [];
    }

    // Filtrar rutinas que ya están asignadas para evitar duplicados
    const newRoutines = routineIds.filter(routineId => !client.routines.includes(routineId));
    if (newRoutines.length === 0) {
      return res.status(400).json({ message: "Todas las rutinas ya están asignadas al cliente" });
    }

    // Añadir las nuevas rutinas al arreglo
    client.routines.push(...newRoutines);
    await client.save();

    res.status(200).json({
      message: "Rutinas asignadas al cliente exitosamente",
      data: { clientId, routineIds: newRoutines },
    });
  } catch (error) {
    console.error('Error al asignar múltiples rutinas:', error);
    res.status(500).json({ message: "Error al asignar las rutinas", error: error.message });
  }
};


export const getClientRoutines = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    // Buscar el cliente y poblar las rutinas
    const client = await Client.findById(clientId).populate('routines');
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Devolver las rutinas asignadas
    res.status(200).json({
      message: "Rutinas obtenidas exitosamente",
      data: client.routines,
    });
  } catch (error) {
    console.error('Error al obtener las rutinas del cliente:', error);
    res.status(500).json({ message: "Error al obtener las rutinas", error: error.message });
  }
};



export const removeRoutineFromClient = async (req, res) => {
  const { clientId, routineId } = req.params;

  try {
    // Validar que los IDs sean válidos
    if (!mongoose.Types.ObjectId.isValid(clientId) || !mongoose.Types.ObjectId.isValid(routineId)) {
      return res.status(400).json({ message: "ID de cliente o rutina inválido" });
    }

    // Buscar el cliente
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Verificar si la rutina está asignada y eliminarla
    const routineIndex = client.routines.indexOf(routineId);
    if (routineIndex === -1) {
      return res.status(400).json({ message: "La rutina no está asignada a este cliente" });
    }

    client.routines.splice(routineIndex, 1); // Eliminar la rutina del arreglo
    await client.save();

    res.status(200).json({
      message: "Rutina eliminada del cliente exitosamente",
      data: { clientId, routineId },
    });
  } catch (error) {
    console.error('Error al eliminar rutina del cliente:', error);
    res.status(500).json({ message: "Error al eliminar la rutina del cliente", error: error.message });
  }
};







