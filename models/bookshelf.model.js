import { Schema, model } from 'mongoose';

const bookshelfSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		books: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Book',
			},
		],
		isPrivate: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

const Bookshelf = model('Bookshelf', bookshelfSchema);

export default Bookshelf;
