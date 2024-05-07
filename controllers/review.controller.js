import Review from '../models/review.model.js';
import User from '../models/user.model.js';
import createError from '../utils/createError.js';

export const createReview = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId).select(
			'name surname username'
		);
		const isExist = await Review.findOne({
			user: user._id,
			book: req.body.book,
		});

		if (isExist) {
			return next(createError(500, 'You already add review for this book'));
		} else {
			const review = await new Review(req.body).save();
			res.status(201).send({
				success: true,
				data: { ...review._doc, user },
			});
		}
	} catch (err) {
		next(err);
	}
};

export const deleteReview = async (req, res, next) => {
	try {
		await Review.findByIdAndDelete(req.params.id);

		res.status(200).send({
			success: true,
			message: 'Review has been successfully deleted',
		});
	} catch (err) {
		next(err);
	}
};

export const updateReview = async (req, res, next) => {
	try {
		const updatedReview = await Review.findByIdAndUpdate(
			req.body.reviewId,
			{ text: req.body.text, rate: req.body.rate },
			{ new: true }
		);

		res.status(200).send({
			success: true,
			data: updatedReview,
			message: 'Review has been successfully updated',
		});
	} catch (err) {
		next(err);
	}
};

export const getUserReviews = async (req, res, next) => {
	try {
		const reviews = await Review.find({ user: req.userId }).populate('book');

		res.status(200).send({ success: true, data: reviews });
	} catch (err) {
		next(err);
	}
};

export const addResponse = async (req, res, next) => {
	try {
		const user = await User.findById(req.userId);
		const review = await Review.findByIdAndUpdate(
			req.body.reviewId,
			{ $push: { responses: { ...req.body, user } } },
			{ new: true }
		);

		res.status(200).send({ success: true, data: review });
	} catch (err) {
		next(err);
	}
};

export const deleteResponse = async (req, res, next) => {
	try {
		const review = await Review.findByIdAndUpdate(
			req.body.reviewId,
			{ $pull: { responses: { _id: req.body.resId } } },
			{ new: true }
		);

		res.status(200).send({ success: true, data: review });
	} catch (err) {
		next(err);
	}
};

export const updateResponse = async (req, res, next) => {
	try {
		const { text, reviewId, resId } = req.body;

		const review = await Review.findOneAndUpdate(
			{ _id: reviewId, 'responses._id': resId },
			{ $set: { 'responses.$.text': text } },
			{ new: true }
		);

		res.status(200).send({
			success: true,
			data: review,
			message: 'Your response successfully updated',
		});
	} catch (err) {
		next(err);
	}
};
