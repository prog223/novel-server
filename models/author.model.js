import { Schema, model } from 'mongoose';

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

const Author = model('Author', authorSchema);

export default Author;
