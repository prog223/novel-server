import express from 'express';
import {
	addBookToBookshelf,
	createBookshelf,
	deleteBookFromBookshelf,
	deleteBookshelf,
	getBookshelf,
	getBookshelfs,
	updateBookshelf,
} from '../controllers/bookshelf.controller.js';

const router = express.Router();

router.get('/', getBookshelfs);
router.get('/:id', getBookshelf);
router.post('/', createBookshelf);
router.post('/add_book', addBookToBookshelf);
router.post('/delete_book', deleteBookFromBookshelf);
router.post('/update', updateBookshelf);
router.delete('/:id', deleteBookshelf);

export default router;
