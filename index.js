import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import exphbs from 'express-handlebars';
import verifyToken from './middleware/jwt.js';
dotenv.config();

import authRoute from './routes/auth.route.js';
import bookRoute from './routes/book.route.js';
import userRoute from './routes/user.route.js';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname, 'templates');

app.use('/api/auth', authRoute);
app.use('/api/book', verifyToken, bookRoute);
app.use('/api/user', verifyToken, userRoute);

app.use((err, req, res, next) => {
	if (!err.status) {
		return res
			.status(500)
			.send({ success: false, message: 'Something went wrong' });
	}

	return res.status(err.status).send({ success: false, message: err.message });
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
