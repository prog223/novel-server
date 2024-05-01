import express from 'express';
import verifyToken from '../middleware/jwt.js';
import {
	login,
	logout,
	register,
	updatePassword,
	verify,
	resetPasswordRequest,
	resetPassword,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/verify/:token', verify);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset_password_request', resetPasswordRequest);
router.post('/reset_password', resetPassword);
router.post('/update_password', verifyToken, updatePassword);

export default router;
