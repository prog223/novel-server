import User from '../models/user.model.js';
import Token from '../models/token.model.js';
import createError from '../utils/createError.js';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/sendEmail.js';
import { createToken } from '../utils/createToken.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
	try {
		const username = await User.findOne({
			username: req.body.username,
		});

		if (username)
			return next(
				createError(400, 'User with the same username already exists')
			);
		const email = await User.findOne({ emai: req.body.email });
		if (email)
			return next(
				createError(400, 'Account with this email already exists')
			);

		const newUser = new User({
			...req.body,
		});

		const token = createToken(newUser);
		if (!token) return next();

		const link = `${process.env.BASE_URL}/api/auth/verify/${token}`;
		await sendEmail(newUser.email, link, 'verification_email.handlebars');

		await newUser.save();
		res.status(201).send({
			success: true,
			message: 'User successfully created',
		});
	} catch (err) {
		next(err);
	}
};

export const verify = async (req, res, next) => {
	try {
		const { token } = req.params;
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		const user = await User.findById(decoded.id);
		if (!user)
			return next(
				createError(
					400,
					'Email verification failed, possibly the link is invalid or expired.'
				)
			);

		user.isVerified = true;
		await user.save();

		res.redirect(`${process.env.CLIENT_URL}/login`);
	} catch (err) {
		next(err);
	}
};

export const login = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) return next(createError(400, 'User not found'));
		if (!user.isVerified) return next(createError(400, 'Verify first'));

		const isCorrect = bcrypt.compareSync(req.body.password, user.password);
		if (!isCorrect)
			return next(createError(400, 'Wrong password or username'));

		const token = jwt.sign(
			{
				id: user._id,
				role: user.role,
			},
			process.env.JWT_KEY
		);

		const { password, createdAt, updatedAt, ...info } = user._doc;

		res.cookie('accessToken', token, {
			httpOnly: true,
			sameSite: 'none',
			secure: true,
		})
			.status(200)
			.send({ success: true, data: info });
	} catch (err) {
		next(err);
	}
};

export const logout = (req, res, next) => {
	try {
		res.clearCookie('accessToken', {
			sameSite: 'none',
			secure: true,
		})
			.status(200)
			.send({ success: true, message: 'User has been logged out' });
	} catch (err) {
		next(err);
	}
};

export const resetPasswordRequest = async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) return next(createError(404, 'User nor exist'));
		if (!user.isVerified) return next(createError(400, 'Verify first'));

		const token = await Token.findOne({ userId: user._id });
		if (token) token.deleteOne();

		const resetToken = crypto.randomBytes(32).toString('hex');
		const hash = await bcrypt.hash(
			resetToken,
			Number(process.env.HASH_NUMBER)
		);

		await new Token({
			userId: user._id,
			token: hash,
			createdAt: Date.now(),
		}).save();

		const link = `${process.env.CLIENT_URL}/password_reset?token=${resetToken}&id=${user._id}`;
		await sendEmail(user.email, link, 'reset_password.handlebars');

		res.status(200).send({
			success: true,
			message: 'Reset password instructions sended to your email',
		});
	} catch (err) {
		next(err);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		const { userId, password, token } = req.body;

		const passwordResetToken = await Token.findOne({
			userId,
		});
		if (!passwordResetToken)
			return next(
				createError(404, 'Invalid or expired password reset token')
			);

		const isValid = await bcrypt.compare(token, passwordResetToken.token);
		if (!isValid)
			return next(
				createError(404, 'Invalid or expired password reset token')
			);

		await User.updateOne(
			{ _id: userId },
			{ $set: { password } },
			{ new: true }
		);

		await passwordResetToken.deleteOne();

		res.status(200).send({
			success: true,
			message: 'Password successfully updated',
		});
	} catch (err) {
		next(err);
	}
};

export const updatePassword = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) return next(createError(404, 'User not found'));

		await User.updateOne(
			{
				_id: req.userId,
			},
			{ $set: { password: req.body.password } },
			{ new: true }
		);

		res.status(200).send({
			success: true,
			message: 'Password successfully updated',
		});
	} catch (err) {
		next(err);
	}
};
