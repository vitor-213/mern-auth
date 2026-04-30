import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No autorizado, sin token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 aquí traes el usuario completo
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    req.user = user; // ahora es objeto completo

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default protect;
