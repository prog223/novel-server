import Book from '../models/book.model.js';
import Genre from '../models/genre.model.js';
import createError from '../utils/createError.js';

export const createBook = async (req, res, next) => {
	try {
		const book = new Book(req.body);
		await book.save();

		if (!book) return next(createError(500, 'Something went wrong'));
		res.status(200).send({ success: true, data: book });
	} catch (err) {
		next(err);
	}
};

export const getBooks = async (req, res, next) => {
	try {
		const q = req.query;
		const genre = await Genre.findOne({ name: q.genre });
		let filter = {};
		if (genre && genre.name !== 'All') {
			filter = { genre: genre._id };
		}

		const totalCount = await Book.countDocuments();
		const pagination = paginate(totalCount, q.page, q.pageSize);

		const books = await Book.find({
			...filter,
			...(q.search && { name: { $regex: q.search, $options: 'i' } }),
		})
			.populate('genre')
			.populate('author')
			.skip((q.page - 1) * q.pageSize)
			.limit(q.pageSize)
			.exec();

		res.status(200).send({ success: true, data: books, pagination });
	} catch (err) {
		next(err);
	}
};

export const getBook = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) return next(createError(404, 'Book not found'));

		res.status(200).send({ success: true, data: book });
	} catch (err) {
		next(err);
	}
};

export const updateBook = async (req, res, next) => {
	try {
		const updatedBook = await Book.findByIdAndUpdate(req.body.id, req.body, {
			new: true,
		});

		res.status(200).send({
			success: true,
			data: updatedBook,
			message: 'Book successfully updated',
		});
	} catch (err) {
		next(err);
	}
};

export const deleteBook = async (req, res, next) => {
	try {
		await Book.findByIdAndDelete(req.params.id);

		res.status(200).send({
			success: true,
			message: 'Book successfully deleted',
		});
	} catch (err) {
		next(err);
	}
};
