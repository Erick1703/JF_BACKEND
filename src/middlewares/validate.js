import jwt from "jsonwebtoken";

export const authorizeRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token; // Obtén el token desde las cookies
      if (!token) {
        return res.status(401).json({ message: "Acceso no autorizado" });
      }

      // Verifica y decodifica el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Comprueba si el rol del usuario está dentro de los roles permitidos
      if (!requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Acceso denegado" });
      }

      req.user = decoded; // Adjunta los datos del token al objeto `req`
      next(); // Permite continuar si el rol es válido
    } catch (error) {
      res.status(500).json({ message: "Error en la validación del rol" });
    }
  };
};