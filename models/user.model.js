import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import Book from './book.model.js';
import Review from './review.model.js';

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
	image: {
		id: String,
		url: {
			type: String,
			default: process.env.DEFAULT_PROFILE_IMG,
		},
	},
	role: {
		type: String,
		enum: ['admin', 'user', 'author'],
		default: 'user',
	},
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

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	const hash = await bcrypt.hash(
		this.password,
		Number(process.env.HASH_NUMBER)
	);
	this.password = hash;
	next();
});

userSchema.pre('updateOne', async function (next) {
	const update = this.getUpdate();
	if (update.password && typeof update.password === 'string') {
		const hash = await bcrypt.hash(
			update.password,
			Number(process.env.HASH_NUMBER)
		);
		update.password = hash;
	}
	next();
});

userSchema.pre('deleteOne', async function (next) {
	const user = await User.findById(this._conditions);
	await Book.deleteMany({ userAuthor: user });
	await Review.deleteMany({ user });
	next();
});

const User = model('User', userSchema);

export default User;
