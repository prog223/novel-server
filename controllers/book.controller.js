import Book from '../models/book.model.js';
import Genre from '../models/genre.model.js';
import createError from '../utils/createError.js';

export const createBook = async (req, res, next) => {
	try {
		const book = new Book(req.body);
		book.save();
		if (!book) return next(createError(500, 'Something went wrong'));
		res.status(200).send(book);
	} catch (error) {
		next(error);
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

		const localBooksQuery = Book.find({
			...filter,
			...(q.search && { name: { $regex: q.search, $options: 'i' } }),
		})
			.populate('genre')
			.populate('author');

		const localBooks = await localBooksQuery.exec();

		const page = parseInt(q.page) || 1;
		const pageSize = parseInt(q.pageSize) || 10;
		const startIndex = (page - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		const paginatedBooks = localBooks.slice(startIndex, endIndex);

		if (!paginatedBooks.length)
			return next(createError(404, 'Books not found'));

		res.status(200).send(paginatedBooks);
	} catch (err) {
		next(err);
	}
};

export const getBook = async (req, res, next) => {
	try {
		const book = await Book.findById(req.params.id);
		if (!book) return next(createError(404, 'Book not found'));

		res.status(200).send(book);
	} catch (err) {
		next(err);
	}
};

export const updateBook = async (req, res, next) => {
	try {
		const updatedBook = await Book.findByIdAndUpdate(req.body.id, req.body, {
			new: true,
		});

		res.status(200).send(updatedBook);
	} catch (err) {
		next(err);
	}
};

export const deleteBook = async (req, res, next) => {
	try {
		await Book.findByIdAndDelete(req.params.id)

		res.status(200).send('Book successfully deleted')
	} catch (err) {
		next(err)
	}
};