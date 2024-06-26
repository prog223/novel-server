import createError from '../utils/createError.js';
import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
	const token = req.cookies?.accessToken;
	if (!token) return next(createError(401, 'You are not authenticated'));

	jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
		if (err) return next(createError(403, 'Token is not valid'));
		req.userId = payload.id;
		req.role = payload.role;
		next();
	});
};

export default verifyToken;
