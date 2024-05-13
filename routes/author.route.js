import express from 'express';
import {
	createAuthor,
	deleteAuthor,
	getAuthor,
	getAuthors,
	updateAuthor,
} from '../controllers/author.controller.js';
import adminAccess from '../middleware/adminAccess.js';

const router = express.Router();

router.post('/', createAuthor);
router.post('/update/:id', adminAccess, updateAuthor);
router.get('/', getAuthors);
router.get('/:id', getAuthor);
router.delete('/:id', adminAccess, deleteAuthor);

export default router;
