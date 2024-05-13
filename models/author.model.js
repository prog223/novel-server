import { Schema, model } from 'mongoose';
import Book from './book.model.js';

const authorSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	about: {
		type: String,
	},
	birthday: {
		type: Date,
	},
	books: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Book',
		},
	],
});

authorSchema.pre('deleteOne', async function (next) {
	const author = await Author.findById(this._conditions);
	await Book.deleteMany({ author });
	next();
});

const Author = model('Author', authorSchema);

export default Author;
