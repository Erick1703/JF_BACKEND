import Cliente from "../models/cliente.model.js";
import Trainer from "../models/trainer.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CreateAccessToken } from "../libs/jwt.js";

export const registerClient = async (req, res) => {
  const { nombre, apellido, email, password, telefono, trainer } = req.body;

  try {
    // Validar que se proporcione el ID del entrenador
    if (!trainer) {
      return res.status(400).json({ message: "El ID del entrenador es requerido" });
    }

    // Hashear la contraseña
    const passhash = await bcrypt.hash(password, 10);

    // Crear el nuevo cliente
    const newClient = new Cliente({
      nombre,
      apellido,
      email,
      password: passhash,
      telefono,
      trainer, // Guardamos la referencia al entrenador
    });

    // Guardar el cliente en la colección Cliente
    const clientSave = await newClient.save();

    // Crear el token para el cliente
    const token = await CreateAccessToken({ id: clientSave._id, role: "client" });
    res.cookie("token", token);

    // Actualizar el arreglo 'clientes' del entrenador
    const trainerUpdate = await Trainer.findByIdAndUpdate(
      trainer, // Buscar al entrenador por su ID
      {
        $push: {
          clientes: {
            _id: clientSave._id,
            nombre: clientSave.nombre,
            apellido: clientSave.apellido,
            email: clientSave.email,
        
          },
        },
      },
      { new: true } // Devolver el documento actualizado (opcional)
    );

    if (!trainerUpdate) {
      // Si el entrenador no se encuentra, no es crítico, pero podrías manejarlo
      console.warn(`Entrenador con ID ${trainer} no encontrado al actualizar clientes`);
    }

    // Respuesta al frontend
    res.status(201).send("Cliente registrado y añadido al entrenador exitosamente");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerTrainer = async (req, res) => {
const { nombre, apellido, email, password, telefono } = req.body;
try{

  const passhash = await bcrypt.hash(password, 10);

  const newtrainer = new Trainer({
    nombre,
    apellido,
    email,
    password: passhash,
    telefono
  });

  const trainerSave = await newtrainer.save();

  const token =  await CreateAccessToken({ id: trainerSave._id, role: "trainer"});
    res.cookie("token", token)
 

    res.send("Entrenador registrado");

}catch(error){
  res.status(500).json({ message: error.message });
}


}

export const loginTrainer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el entrenador por correo electrónico
    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
      return res.status(404).json({ message: "Entrenador no encontrado" });
    }
    if (!trainer.isActive) {
      return res.status(403).json({
        message: "Usted está desactivado, comuníquese con un agente de JobsyFitness",
      });
    }
    //comparar las conraseñas 
    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

   //creando el token
    const token = await CreateAccessToken({ id: trainer._id , role: "trainer"});

    // Depuración: Imprimir el token y su contenido
    
    const decoded = jwt.decode(token);
    console.log('Token decodificado:', decoded);

    // Extraer el id
    const userId = decoded ? decoded.id : undefined;
    console.log('userId extraído:', userId);

    if (!userId) {
      return res.status(500).json({ message: "Error: No se pudo extraer el ID del token" });
    }

    // Establecer solo el id como cookie
    res.cookie("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Enviar solo el id en la respuesta JSON
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      id: userId,
      role: "trainer",
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginCliente = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el cliente por correo electrónico
    const cliente = await Cliente.findOne({ email });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }


    
    if (!cliente.isActive) {
      return res.status(403).json({
        message: "Usted está desactivado, por favor comuníquese con su entrenador",
      });
    }

    // Comparar las contraseñas
    const isMatch = await bcrypt.compare(password, cliente.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Crear el token
    const token = await CreateAccessToken({ id: cliente._id, role: "client" });

    // Depuración: Imprimir el token y su contenido
   
    const decoded = jwt.decode(token);
    console.log('Token decodificado:', decoded);

    // Extraer el id
    const userId = decoded ? decoded.id : undefined;
   

    if (!userId) {
      return res.status(500).json({ message: "Error: No se pudo extraer el ID del token" });
    }

    // Establecer solo el id como cookie
    res.cookie("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    // Enviar solo el id en la respuesta JSON
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      id: userId,
      role: "client",
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {

try{
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo cookies seguras en producción
    sameSite: "strict", // Protección contra ataques CSRF 
  })

  res.send("Cierre de sesión exitoso");
}catch(error){
  res.status(500).json({ message: error.message });
  
}

}