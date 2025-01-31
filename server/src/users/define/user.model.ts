import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	authentication: {
		salt: { type: String, select: false },
		password: { type: String, required: true, select: false }
	},
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});