import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: 'admin' | 'user' | 'author',
	books: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Book',
		},
	],
	bookshelves: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Bookshelf',
		},
	],
	isVerified: {
		type: Boolean,
		default: false,
	},
});

const User = model('User', userSchema);

export default User;