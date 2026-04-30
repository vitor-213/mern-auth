import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. verificar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no existe" });
    }

    // 2. comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 3. generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // 👇 enviar cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en producción (HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 4. respuesta
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // verificar si existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Usuario ya existe" });
    }

    // encriptar password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // crear usuario
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuario registrado",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FORGOT PASSWORD
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no existe" });
    }

    // generar token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // hash del token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // guardar hash en DB
    user.resetToken = hashedToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // crear link
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // configurar email (ejemplo simple)

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Auth App" <no-reply@test.com>',
      to: user.email,
      subject: "Reset Password",
      text: `Click aquí: ${resetUrl}`,
    });

    res.json({ message: "Email enviado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RESET PASSWORD
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // hashear token recibido
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // encriptar nueva password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // limpiar token
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password actualizada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Ruta protegida 🔐",
    userId: req.user,
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({ message: "Logout exitoso" });
});

//PROTEC VALIDA TOKEN DESDE COOKIE
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;
