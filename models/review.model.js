import { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		rate: {
			type: Number,
			required: true,
			min: 0,
			max: 5,
		},
		book: {
			type: Schema.Types.ObjectId,
			ref: 'Book',
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		responses: [
			{
				user: {
					type: Schema.Types.ObjectId,
					ref: 'User',
				},
				text: {
					type: String,
					required: true,
				},
				created_at: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Review = model('Review', reviewSchema);

export default Review;
