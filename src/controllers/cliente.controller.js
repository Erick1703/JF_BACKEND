import Cliente from "../models/cliente.model.js";
import mongoose from "mongoose";



export const activarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    // Buscar el cliente por ID
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Activar el cliente
    cliente.isActive = true;
    await cliente.save();

    res.status(200).json({ message: "Cliente activado con éxito", cliente });
  } catch (error) {
    console.error('Error al activar cliente:', error);
    res.status(500).json({ message: "Error al activar el cliente", error: error.message });
  }
};

export const desactivarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de cliente inválido" });
    }

    // Buscar el cliente por ID
    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Desactivar el cliente
    cliente.isActive = false;
    await cliente.save();

    res.status(200).json({ message: "Cliente desactivado con éxito", cliente });
  } catch (error) {
    console.error('Error al desactivar cliente:', error);
    res.status(500).json({ message: "Error al desactivar el cliente", error: error.message });
  }
};

// Controlador para obtener un cliente por ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Se requiere un ID de cliente" });
    }

    const client = await Cliente.findById(id)
      .select("nombre apellido email telefono _id")
      .lean();

    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json({ client });
  } catch (error) {
    console.error("Error al buscar cliente por ID:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};