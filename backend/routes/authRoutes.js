import express from "express";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  logoutUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
