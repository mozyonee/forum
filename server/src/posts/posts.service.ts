import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserDto } from '../users/define/user.dto';
import { PostDto } from './define/post.dto';

@Injectable()
export class PostsService {
	constructor(@InjectModel('Post') private readonly postModel: mongoose.Model<PostDto>) { }

	async getPostByID(id: string) {
		const [result] = await this.postModel.aggregate([
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

	async getPostTreeByID(id: string) {
		const [result] = await this.postModel.aggregate([
	
			{ $match: { _id: new mongoose.Types.ObjectId(id) } }, // get base
			{ $limit: 1 },
			{ $project: { _id: 1 } },
	
			{ $graphLookup: { from: "posts", startWith: "$_id", connectFromField: "parent", connectToField: "_id", as: "post", depthField: "level" } },
			{ $unwind: "$post" },
			{ $sort: { "post.level": -1 } },
	
			{ $lookup: { from: "users", localField: "post.author", foreignField: "_id", as: "post.author" } },
			{ $unwind: { path: "$post.author", preserveNullAndEmptyArrays: true } },
			{ $project: { 'post.author.authentication': 0 } }, // .populate('author');
	
			{ $lookup: { from: 'posts', let: { postId: '$post._id' }, pipeline: [ { $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' } ], as: 'repliesCountData' } },
			{ $addFields: { 'post.repliesCount': { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0 ] } } },
			{ $project: { repliesCountData: 0 } }, // count replies
	
			{ $group: { _id: "$_id", posts: { $push: "$post" } } },
			{ $project: { _id: 0, posts: { $reverseArray: "$posts" } } },
		]);
	
		return result?.posts;
	};

	async getParents(parent: string | null) {
		const posts = await this.getPostTreeByID(parent);

		return posts;
	}

	async getReplies(parent: string | null) {
		const posts = await this.postModel.aggregate([
			{ $match: { parent: parent ? new mongoose.Types.ObjectId(parent) : null } }, // get replies to post
	
			{ $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
			{ $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
			{ $project: { 'author.authentication': 0 } }, // .populate('author');
	
			{ $lookup: { from: 'posts', let: { postId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$parent', '$$postId'] } } }, { $count: 'count' }], as: 'repliesCountData' } },
			{ $addFields: { repliesCount: { $ifNull: [{ $arrayElemAt: ['$repliesCountData.count', 0] }, 0] } } },
			{ $project: { repliesCountData: 0 } }, // count replies
		]);

		return posts;
	};

	async searchPosts(query: string) {
		const posts = await this.postModel.find({ text: { $regex: query, $options: 'i' }, }).populate('author');

		return posts;
	};
	
	async createPost(body: { author: string, text: string, attachments: string[] }) {
		const { author, text, attachments } = body;

		if (!author || !(text || attachments.length)) throw new BadRequestException('No content provided');

		const created = await this.postModel.create(body);
		const result = await this.getPostByID(created._id.toString());

		return result;
	};

	async likePost(body: { user: UserDto, post: PostDto }) {
			const { user, post } = body;

			const postData = await this.getPostByID(post._id);
			const likes: mongoose.Types.ObjectId[] = postData?.likes || [];
			const condition = likes.some((liked: mongoose.Types.ObjectId) => liked.toString() === user._id);

			const updatedLikes = condition
			  ? likes.filter((liked: mongoose.Types.ObjectId) => liked.toString() !== user._id)
			  : [...likes, new mongoose.Types.ObjectId(user._id)];
			
			await this.postModel.findOneAndUpdate({ _id: post._id }, { likes: updatedLikes });

			return { ...post, likes: updatedLikes };
	};

	async repostPost(body: { user: UserDto; post: PostDto }) {
		const { user, post } = body;
	  
		const postData = await this.getPostByID(post._id);
		const reposts: mongoose.Types.ObjectId[] = postData?.reposts || [];
		const condition = reposts.some((reposted: mongoose.Types.ObjectId) => reposted.toString() === user._id);
	  
		const updatedReposts = condition
		  ? reposts.filter((reposted: mongoose.Types.ObjectId) => reposted.toString() !== user._id)
		  : [...reposts, new mongoose.Types.ObjectId(user._id)];
	  
		await this.postModel.findOneAndUpdate({ _id: post._id }, { reposts: updatedReposts });
	  
		return { ...post, reposts: updatedReposts };
	  }
	  

	async deletePost(body: { post: string }) {
		const { post } = body;

		if (!post) throw new BadRequestException('No post provided');

		const deletePostRecursively = async (id: string | null) => {
			const childPosts = await this.postModel.find({ parent: new mongoose.Types.ObjectId(id) });

			for (const child of childPosts) {
				await deletePostRecursively(child._id.toString());
			}

			await this.postModel.findOneAndDelete({ _id: id });
		};

		await deletePostRecursively(post);

		return post;
	};

}
