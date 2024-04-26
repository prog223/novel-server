import express from 'express';
import { createBook, deleteBook, getBook, getBooks, updateBook } from '../controllers/book.controller.js';

const router = express.Router();

router.post('/', createBook)
router.post('/update_book', updateBook)
router.get('/get_books', getBooks)
router.get('/:id', getBook)
router.delete('/:id', deleteBook)

export default router;
