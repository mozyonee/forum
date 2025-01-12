import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
	parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	date: { type: Date, default: Date.now },
	author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	text: { type: String },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	attachments: [{ type: String }]
});

export const postModel = mongoose.model('Post', postSchema);

export const getPostByID = async (id: string) => {
	const [result] = await postModel.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(id) } }, // get post

		{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
		{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
		{ $project: { 'author.authentication': 0 } }, // .populate('author');

		{ $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData', }, },
		{ $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
		{ $project: { repliesCountData: 0 } }, // count replies
	]);

	if (!result) throw new Error('Post not found');
	return result;
};

export const getPostsByUserID = async (id: string) => {
	return await postModel.aggregate([
		{ $match: { parent: null, author: new mongoose.Types.ObjectId(id) } }, // get post by author

		{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
		{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
		{ $project: { 'author.authentication': 0 } }, // .populate('author');

		{ $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
		{ $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
		{ $project: { repliesCountData: 0 } }, // count replies
	]);
};

export const getPostTreeByID = async (id: string) => {
	const [result] = await postModel.aggregate([

		{ $match: { _id: new mongoose.Types.ObjectId(id) } },
		{ $limit: 1 },
		{ $project: { _id: 1 } },

		{ $graphLookup: { from: "posts", startWith: "$_id", connectFromField: "parent", connectToField: "_id", as: "post", depthField: "level" } },
		{ $unwind: "$post" },
		{ $sort: { "post.level": -1 } },

		{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
		{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
		{ $project: { 'author.authentication': 0 } }, // .populate('author');

		{ $lookup: { from: 'posts', let: { postId: '$post._id' }, pipeline: [ { $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' } ], as: 'repliesCountData' } },
		{ $addFields: { 'post.repliesCount': { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0 ] } } },
		{ $project: { repliesCountData: 0 } },

		{ $group: { _id: "$_id", posts: { $push: "$post" } } },
		{ $project: { _id: 0, posts: { $reverseArray: "$posts" } } },
	]);

	return result.posts;
};

export const getPostsByParentId = async (id: string | null) => {
	return await postModel.aggregate([
		{ $match: { parent: id ? new mongoose.Types.ObjectId(id) : null } }, // get replies to post

		{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
		{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
		{ $project: { 'author.authentication': 0 } }, // .populate('author');

		{ $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
		{ $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
		{ $project: { repliesCountData: 0 } }, // count replies
	]);
};

export const getLikesByUserID = async (id: string) => {
	return await postModel.aggregate([
		{ $match: { likes: { $in: [new mongoose.Types.ObjectId(id)] } } }, // get posts liked by user

		{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
		{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
		{ $project: { 'author.authentication': 0 } }, // .populate('author');

		{ $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
		{ $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
		{ $project: { repliesCountData: 0 } }, // count replies
	]);
};

export const getRepostsByUserID = async (id: string) => {
	return await postModel.aggregate([
		{ $match: { reposts: { $in: [new mongoose.Types.ObjectId(id)] } } }, // get posts reposted by user

		{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
		{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
		{ $project: { 'author.authentication': 0 } }, // .populate('author');

		{ $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
		{ $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
		{ $project: { repliesCountData: 0 } } // count replies
	]);
};

export const getRepliesByUserID = async (id: string) => {
	return await postModel.aggregate([
		{ $match: { parent: { $ne: null }, author: new mongoose.Types.ObjectId(id) } }, // get replies by author

		{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author', }, },
		{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
		{ $project: { 'author.authentication': 0 } }, // .populate('author');

		{ $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
		{ $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
		{ $project: { repliesCountData: 0 } }, // count replies
	]);
};

export const createPost = (values: Record<string, any>) => postModel.create(values);
export const updatePostById = (id: string, values: Record<string, any>) => postModel.findOneAndUpdate({ _id: id }, values);
export const deletePostById = (id: string) => postModel.findOneAndDelete({ _id: id });
