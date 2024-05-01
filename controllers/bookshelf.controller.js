import Book from '../models/book.model.js';
import Bookshelf from '../models/bookshelf.model.js';
import User from '../models/user.model.js';
import createError from '../utils/createError.js';

export const createBookshelf = async (req, res, next) => {
	try {
		const userData = await User.findById(req.userId);
		if (!userData) return next(createError(404, 'User not found'));

		const bookshelf = await new Bookshelf({
			...req.body,
			user: userData,
		}).save();
		const { user, ...data } = bookshelf._doc;

		res.status(200).send({ success: true, data });
	} catch (err) {
		next(err);
	}
};

export const getBookshelf = async (req, res, next) => {
	try {
		const bookshelf = await Bookshelf.findById(req.params.id).populate(
			'books'
		);
		if (!bookshelf) return next(createError(404, 'Bookshelf not found'));

		res.status(200).send({ sussess: false, data: bookshelf });
	} catch (err) {
		next(err);
	}
};

export const getBookshelfs = async (req, res, next) => {
	try {
		const bookshelfs = await Bookshelf.find({ user: { _id: req.userId } });

		res.status(200).send({ success: true, data: bookshelfs });
	} catch (err) {
		next(err);
	}
};

export const deleteBookshelf = async (req, res, next) => {
	try {
		await Bookshelf.findByIdAndDelete(req.params.id);

		res.status(200).send({
			success: true,
			message: 'Bookshelf has been successfully deleted',
		});
	} catch (err) {
		next(err);
	}
};

export const updateBookshelf = async (req, res, next) => {
	try {
		const updatedBookshelf = await Bookshelf.findByIdAndUpdate(
			req.body.id,
			{ name: req.body.name },
			{ new: true }
		);
		if (!updatedBookshelf)
			return next(createError(404, 'Bookshelf not found'));

		res.status(200).send({
			success: true,
			data: updateBookshelf,
			message: 'Bookshelf has been successfully updated',
		});
	} catch (err) {
		next(err);
	}
};

export const addBookToBookshelf = async (req, res, next) => {
	try {
		const book = await Book.findById(req.body.bookId).populate('bookshelf');

		if (book.bookshelf?._id == req.body.bookshelfId) {
			res.status(200).send({
				success: false,
				message: 'Book already added in this bookshelf',
			});
		} else {
			const bookshelf = await Bookshelf.findByIdAndUpdate(
				req.body.bookshelfId,
				{ $push: { books: book } },
				{ new: true }
			);

			book.bookshelf = bookshelf;
			await book.save();

			res.status(200).send({
				success: true,
				data: bookshelf,
				message: 'Book has been successully added',
			});
		}
	} catch (err) {
		next(err);
	}
};

export const deleteBookFromBookshelf = async (req, res, next) => {
	try {
		const book = await Book.findById(req.body.bookId).populate('bookshelf');

		const bookshelf = await Bookshelf.findByIdAndUpdate(
			req.body.bookshelfId,
			{ $pull: { books: book._id } },
			{ new: true }
		);

		book.bookshelf = null;
		await book.save();

		res.status(200).send({
			success: true,
			data: bookshelf,
			message: 'Book has been successfully deleted',
		});
	} catch (err) {
		next(err);
	}
};
