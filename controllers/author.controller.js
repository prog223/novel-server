import Author from '../models/author.model.js';
import { paginate } from '../utils/utils.js';

export const createAuthor = async (req, res, next) => {
	try {
		const author = await new Author({
			...req.body,
		}).save();

		res.status(200).send({
			success: true,
			data: author,
			message: 'Author successfully created',
		});
	} catch (err) {
		next(err);
	}
};

export const deleteAuthor = async (req, res, next) => {
	try {
		await Author.deleteOne({_id: req.params.id});

		res.status(200).send({
			success: true,
			message: 'Author successfully deleted',
		});
	} catch (err) {
		next(err);
	}
};

export const updateAuthor = async (req, res, next) => {
	try {
		const updatedAuthor = await Author.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);

		res.status(200).send({
			success: true,
			data: updatedAuthor,
			message: 'Author successfully updated',
		});
	} catch (err) {
		next(err);
	}
};

export const getAuthors = async (req, res, next) => {
	try {
		// const q = req.query;
		// let filter = {};

		// const totalCount = await Author.countDocuments();
		// const pagination = paginate(totalCount, q.page, q.pageSize);

		// const authors = await Author.find({
		// 	...filter,
		// 	$or: [
		// 		{ name: { $regex: q.search, $options: 'i' } },
		// 		{ surname: { $regex: q.search, $options: 'i' } },
		// 	],
		// })
		// 	.skip((q.page - 1) * q.pageSize)
		// 	.limit(q.pageSize)
		// 	.exec();

		const authors = await Author.find()
		res.status(200).send({ success: true, data: authors });
	} catch (err) {
		next(err);
	}
};

export const getAuthor = async (req, res, next) => {
	try {
		const author = await Author.findById(req.params.id).populate('books');
		if (!author) return next(createError(404, 'Book not found'));

		res.status(200).send({ success: true, data: author });
	} catch (err) {
		next(err);
	}
};
