import express from 'express';
import { deleteUser, getUser, getUsers } from '../controllers/user.controller.js';
import adminAccess from '../middleware/adminAccess.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', adminAccess, deleteUser);

export default router;
