import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // 🔐 opcional: invalidar token si cambió password
    if (user.passwordChangedAt) {
      const changedTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

      if (decoded.iat < changedTime) {
        return res
          .status(401)
          .json({ message: "Token expirado por cambio de password" });
      }
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "No autorizado" });
  }
};

export default protect;
