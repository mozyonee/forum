import { Request, Response } from "express";
import { getUsers, getUserByID, getUserByEmail, getUserByUsername, updateUserById, deleteUserById } from "../models/users";
import { getPostsByUserID, getRepliesByUserID, getRepostsByUserID, getLikesByUserID } from "../models/posts";
import mongoose from "mongoose";
import { userModel } from "../models/users";

const handleError = (res: Response, error: Error) => {
	console.log(error);
	res.sendStatus(500);
};

export const getUser = async (req: Request, res: Response) => {
	try {
		const user = req.query.user;
		const result = user ? await getUserByID(user.toString()) : await getUsers();
		
		if (!result) return res.sendStatus(404);
		res.status(200).json(result).end();
	} catch (error) {
		handleError(res, error);
	}
};

export const searchUsers = async (req: Request, res: Response) => {
	try {
		const query = req.query.query;
		const accounts = await userModel.find({ username: { $regex: query, $options: 'i' }, });

		res.status(200).json(accounts).end();
	} catch (error) {
		handleError(res, error);
	}
};

export const getUsersPosts = async (req: Request, res: Response) => {
	try {
		const user = req.query.user;
		const result = await getPostsByUserID(user.toString());

		if (!result) return res.sendStatus(404);
		res.status(200).json(result).end();
	} catch(error) {
		handleError(res, error)
	}
};

export const getUsersReplies = async (req: Request, res: Response) => {
	try {
		const user = req.query.user;
		const result = await getRepliesByUserID(user.toString());

		if (!result) return res.sendStatus(404);
		res.status(200).json(result).end();
	} catch(error) {
		handleError(res, error)
	}
};

export const getUsersReposts = async (req: Request, res: Response) => {
	try {
		const user = req.query.user;
		const result = await getRepostsByUserID(user.toString());

		if (!result) return res.sendStatus(404);
		res.status(200).json(result).end();
	} catch(error) {
		handleError(res, error)
	}
};


export const getUsersLikes = async (req: Request, res: Response) => {
	try {
		const user = req.query.user;
		const result = await getLikesByUserID(user.toString());

		if (!result) return res.sendStatus(404);
		res.status(200).json(result).end();
	} catch(error) {
		handleError(res, error)
	}
};

export const follow = async (req: Request, res: Response) => {
	try {
		const { follower, followed } = req.body;

		const userData = await getUserByID(follower._id).select('following');
		const following = userData?.following || [];

		let updatedFollowing;
		const condition = following.some((follow: mongoose.Types.ObjectId) => follow.toString() === followed._id);
		
		if (!condition) updatedFollowing = [...following, new mongoose.Types.ObjectId(followed._id)];
		else updatedFollowing = following.filter((follow: mongoose.Types.ObjectId) => follow.toString() !== followed._id);

		follower.following = updatedFollowing;
		await updateUserById(follower._id, { following: updatedFollowing });

		res.status(200).json(follower).end();
	} catch (error) {
		handleError(res, error);
	}
};

export const changeUsername = async (req: Request, res: Response) => {
	try {
		const { user, username } = req.body;

		const users = await getUserByUsername(username);
		if(users) return res.sendStatus(400);

		await updateUserById(user, { username });

		const result = await getUserByID(user);
		res.status(200).json(result).end();
	} catch(error) {
		handleError(res, error);
	}
};

export const changeEmail = async (req: Request, res: Response) => {
	try {
		const { user, email } = req.body;

		const users = await getUserByEmail(email);
		if(users) return res.sendStatus(400);

		await updateUserById(user, { email });

		const result = await getUserByID(user);
		res.status(200).json(result).end();
	} catch(error) {
		handleError(res, error);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		if(!id) return res.sendStatus(400);
		const user = await getUserByID(id);
		if(!user) return res.sendStatus(404);
		await deleteUserById(id);
		res.status(200).json(user).end();
	} catch(error) {
		handleError(res, error);
	}
};