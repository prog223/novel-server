import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
dotenv.config();

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
