import express from 'express';
import {
	createGenre,
	deleteGenre,
	getGenres,
} from '../controllers/genre.controller.js';
import adminAccess from '../middleware/adminAccess.js';

const router = express.Router();

router.get('/', getGenres);
router.post('/', adminAccess, createGenre);
router.delete('/:id', adminAccess, adminAccess, deleteGenre);

export default router;
