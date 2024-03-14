import { Schema, model } from 'mongoose';

const genreSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	image: {
		id: String,
		url: String,
	},
	books: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Book',
		},
	],
});

const Genre = model('Genre', genreSchema);

export default Genre;
