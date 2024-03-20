import express from 'express';
import { login, register, registerAdmin, resetPassword, sendEmail } from '../controllers/auth.controller.js';

const router = express.Router();

// Register User
router.post('/register', register);

// Login
router.post("/login", login);

// Register Admin
router.post('/register-admin', registerAdmin);

// send reset email
router.post("/send-email", sendEmail);

// reset paasword
router.post("/reset-password", resetPassword);

export default router;