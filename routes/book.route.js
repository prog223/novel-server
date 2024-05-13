import express from 'express';
import {
	createBook,
	deleteBook,
	getBook,
	getBooks,
	updateBook,
} from '../controllers/book.controller.js';
import adminAccess from '../middleware/adminAccess.js';

const router = express.Router();

router.get('/get_books', getBooks);
router.get('/:id', getBook);
router.post('/', adminAccess, createBook);
router.post('/update_book', adminAccess, updateBook);
router.delete('/:id', adminAccess, deleteBook);

export default router;
