import express from 'express';
import {
	createBook,
	deleteBook,
	getBook,
	getBooks,
	updateBook,
} from '../controllers/book.controller.js';

const router = express.Router();

router.get('/:id', getBook);
router.get('/get_books', getBooks);
router.post('/', createBook);
router.post('/update_book', updateBook);
router.delete('/:id', deleteBook);

export default router;
