import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
	parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	date: { type: Date, default: Date.now },
	author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	text: { type: String, required: true },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const postModel = mongoose.model('Post', postSchema);

export const getAllPosts = () => postModel.find().populate('author');
export const getPostByID = (id: string) => postModel.findById(id).populate('author');
export const getPostByEmail = (email: string) => postModel.findOne({ email });
export const getPostBySessionToken = (sessionToken: string) => postModel.findOne({
	'authentication.sessionToken': sessionToken
});
export const createPost = (values: Record<string, any>) => postModel.create(values);
export const deletePostById = (id: string) => postModel.findOneAndDelete({_id: id});
export const updatePostById = (id: string, values: Record<string, any>) => postModel.findOneAndUpdate({ _id: id }, values);
export const getPostByReplyId = (id: string) => postModel.find({ replies: id });
export const getPostsByParentId = (id: string | null) => postModel.find({ parent: id }).populate('author');
export const getPostsByUserID = (id: string) => postModel.find({ parent: null, author: id }).populate('author');
export const getRepliesByUserID = (id: string) => postModel.find({ parent: { $ne: null }, author: id }).populate('author');
export const getRepostsByUserID = (id: string) => postModel.find({ reposts: { $in: [id] } }).populate('author');
export const getLikesByUserID = (id: string) => postModel.find({ likes: { $in: [id] } }).populate('author');

