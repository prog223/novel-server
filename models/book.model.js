import { Schema, model } from 'mongoose';

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
	},
	{
		timestamps: true,
	}
);

const Book = model('Book', bookSchema);

export default Book;
