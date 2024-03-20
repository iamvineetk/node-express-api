import express from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// get All Users
router.get("/", verifyAdmin, getAllUsers);

// get specific user by id
router.get("/:id", verifyUser, getUserById);


export default router;