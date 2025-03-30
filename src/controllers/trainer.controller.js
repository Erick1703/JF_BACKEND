import Trainer from "../models/trainer.model.js";


export const getTrainerClients = async (req, res) => {
  try {
    const { trainerId } = req.params;
    if (!trainerId) {
      return res.status(400).json({ message: "El ID del entrenador es requerido" });
    }

    // Buscar al entrenador y popular el campo 'clientes'
    const trainer = await Trainer.findById(trainerId).populate('clientes');

    if (!trainer) {
      return res.status(404).json({ message: "Entrenador no encontrado" });
    }

    res.status(200).json({
      message: "Clientes obtenidos con éxito",
      clients: trainer.clientes,
    });
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
  }
};