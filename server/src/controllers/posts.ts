import { Request, Response } from 'express';
import { getPostByID, getPostTreeByID, getPostsByParentId, createPost, updatePostById, deletePostById } from '../models/posts';
import mongoose from 'mongoose';
import { postModel } from '../models/posts';

const handleError = (res: Response, error: Error) => {
	console.log(error);
	res.sendStatus(500);
};

export const create = async (req: Request, res: Response) => {
	try {
		const { author, text, attachments } = req.body;

		if (!author || !(text || attachments.length)) return res.sendStatus(400);

		const created = await createPost(req.body);
		const result = await getPostByID(created._id.toString());

		res.status(201).json(result);
	} catch (error) {
		handleError(res, error);
	}
};

export const getPosts = async (req: Request, res: Response) => {
	try {
		const parent = req.query.parent;
		const result = parent && await getPostByID(parent.toString());

		if (!result) return res.sendStatus(404);
		res.status(200).json(result);
	} catch (error) {
		handleError(res, error);
	}
};

export const getParents = async (req: Request, res: Response) => {
	try {
		const parent = req.query.parent.toString() || null;
		const result = await getPostTreeByID(parent);

		res.status(200).json(result);
	} catch (error) {
		handleError(res, error);
	}
}

export const getReplies = async (req: Request, res: Response) => {
	try {
		const parent = req.query.parent.toString() || null;
		const result = await getPostsByParentId(parent);

		res.status(200).json(result);
	} catch (error) {
		handleError(res, error);
	}
};

export const searchPosts = async (req: Request, res: Response) => {
	try {
		const query = req.query.query;
		const posts = await postModel.find({ text: { $regex: query, $options: 'i' }, }).populate('author');

		res.status(200).json(posts);
	} catch (error) {
		handleError(res, error);
	}
};

export const remove = async (req: Request, res: Response) => {
	try {
		const { post } = req.body;

		if (!post) return res.sendStatus(400);

		const deletePostRecursively = async (postId: string) => {
			const childPosts = await getPostsByParentId(postId);

			for (const child of childPosts) {
				await deletePostRecursively(child._id.toString());
			}

			await deletePostById(postId);
		};

		await deletePostRecursively(post);

		res.status(200).json(post);
	} catch (error) {
		handleError(res, error);
	}
};

export const like = async (req: Request, res: Response) => {
	try {
		const { user, post } = req.body;

		const postData = await getPostByID(post._id);
		const likes = postData?.likes || [];

		let updatedLikes;
		const condition = likes.some((liked: mongoose.Types.ObjectId) => liked.toString() === user._id);

		if (!condition) updatedLikes = [...likes, new mongoose.Types.ObjectId(user._id)];
		else updatedLikes = likes.filter((liked: mongoose.Types.ObjectId) => liked.toString() !== user._id);

		post.likes = updatedLikes;
		await updatePostById(post._id, { likes: updatedLikes });

		res.status(200).json(post);
	} catch (error) {
		handleError(res, error);
	}
};

export const repost = async (req: Request, res: Response) => {
	try {
		const { user, post } = req.body;

		const postData = await getPostByID(post._id);
		const reposts = postData?.reposts || [];

		let updatedReposts;
		const condition = reposts.some((reposted: mongoose.Types.ObjectId) => reposted.toString() === user._id);

		if (!condition) updatedReposts = [...reposts, new mongoose.Types.ObjectId(user._id)];
		else updatedReposts = reposts.filter((reposted: mongoose.Types.ObjectId) => reposted.toString() !== user._id);

		post.reposts = updatedReposts;
		await updatePostById(post._id, { reposts: updatedReposts });

		res.status(200).json(post);
	} catch (error) {
		handleError(res, error)
	}
};