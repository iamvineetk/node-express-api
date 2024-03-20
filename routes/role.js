import express from 'express';
import { createRole, deleteRole, getAllRoles, updateRole } from '../controllers/role.controller.js';

const router = express.Router();

// Create new role in DB
router.post('/create', createRole);

// Updaterole in DB
router.put('/update/:id', updateRole);

// Get all rows
router.get('/getAll', getAllRoles);

// Delete Role
router.delete('/deleteRole/:id', deleteRole);


export default router;