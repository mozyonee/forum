import mongoose from 'mongoose';

export const postSchema = new mongoose.Schema({
	parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	date: { type: Date, default: Date.now },
	author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	text: { type: String },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	attachments: [{ type: String }]
});