import jwt from 'jsonwebtoken';

export const createToken = (user) => {
	const token = jwt.sign(
		{
			id: user._id,
		},
		process.env.JWT_KEY,
		{ expiresIn: '10m' }
	);

	return token;
};
