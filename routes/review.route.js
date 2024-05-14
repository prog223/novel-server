import express from 'express';
import {
	addResponse,
	createReview,
	deleteResponse,
	deleteReview,
	getBookReviews,
	getUserReviews,
	updateResponse,
	updateReview,
} from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', createReview);
router.post('/update', updateReview);
router.delete('/:id', deleteReview);
router.get('/get_book_reviews', getBookReviews);
router.get('/', getUserReviews);
router.post('/add_response', addResponse);
router.post('/delete_response', deleteResponse);
router.post('/update_response', updateResponse);

export default router;
