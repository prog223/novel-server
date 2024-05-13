import { Schema, model } from 'mongoose';
import Review from './review.model.js';

const bookSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		short_description: {
			type: String,
			required: true,
		},
		image: {
			id: String,
			url: String,
		},
		file: {
			id: String,
			url: String,
		},
		rate: {
			type: Number,
			default: 0,
		},
		pages: {
			type: Number,
		},
		quotes: [
			{
				type: String,
			},
		],
		published: {
			type: Date,
			required: true,
			default: Date.now(),
		},
		isCompleted: {
			type: Boolean,
			default: true,
		},
		genre: {
			type: Schema.Types.ObjectId,
			ref: 'Genre',
		},
		reviews: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Review',
			},
		],
		author: {
			type: Schema.Types.ObjectId,
			ref: 'Author',
		},
		isUserAuthor: {
			type: Boolean,
			default: false,
		},
		userAuthor: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		bookshelf: {
			type: Schema.Types.ObjectId || null,
			ref: 'Bookshelf',
		},
	},
	{
		timestamps: true,
	}
);

bookSchema.pre('deleteOne', async function (next) {
	const book = await Book.findById(this._conditions);
	await Review.deleteMany({ book });
	next();
});

const Book = model('Book', bookSchema);

export default Book;
