import createError from '../utils/createError.js';

const adminAccess = async (req, res, next) => {
	if (req.role !== 'admin') return next(createError(403, 'Access denied'));
	next();
};

export default adminAccess;
