import User from '../models/user.model.js';
import createError from '../utils/createError.js';
import { paginate } from '../utils/utils.js';
import { sendEmail } from '../utils/sendEmail.js';

export const getUsers = async (req, res, next) => {
	try {
		const q = req.query;
		const totalCount = await User.countDocuments();
		const pagination = paginate(totalCount, q.page, q.pageSize);

		const users = await User.find({
			...(q.search && { name: { $regex: q.search, $option: 'i' } }),
			role: { $ne: 'admin' },
		})
			.skip((q.page - 1) * q.pageSize)
			.limit(q.pageSize)
			.exec();

		res.status(200).send({ success: true, data: users, pagination });
	} catch (err) {
		next(err);
	}
};

export const getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id)
			.populate('bookshelves')
			.populate('books')
			.exec();

		if (!user) return next(createError(404, 'User not found'));
		const { password, role, isVerified, ...info } = user._doc;

		res.status(200).send({ success: true, data: info });
	} catch (err) {
		next(err);
	}
};

export const deleteUser = async (req, res, next) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		sendEmail(
			user.email,
			process.env.contactEmail,
			'delete_account.handlebars'
		);
		res.status(200).send({
			success: true,
			message: 'User successfully deleted',
		});
	} catch (err) {
		next(err);
	}
};
