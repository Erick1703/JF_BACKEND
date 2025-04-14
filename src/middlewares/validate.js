// middleware/auth.js
import jwt from 'jsonwebtoken';

export const protectRoute = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Asume Bearer token

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      
      // Verifica si el rol del usuario está en los roles permitidos
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }

      // Agrega el usuario decodificado al request
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
};