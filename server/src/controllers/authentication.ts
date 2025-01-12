import { Request, Response } from 'express';
import { createUser, getUserByEmail, getUserByUsername } from '../models/users';
import { authentication, random } from '../helpers';
import { get } from 'lodash';

const handleError = (res: Response, error: Error) => {
	console.log(error);
	res.sendStatus(500);
};

export const register = async (req: Request, res: Response) => {
	try {
		const { email, password, username } = req.body;

		if(!email || !password || !username) return res.sendStatus(400);

		const existingEmail = await getUserByEmail(email);
		const existingUsername = await getUserByUsername(username);
		
		if(existingEmail || existingUsername) return res.sendStatus(400);

		const salt = random();
		const user = await createUser({
			email,
			username,
			authentication: {
				salt,
				password: authentication(salt, password)
			}
		});
		res.status(200).json(user);
	} catch(error) {
		handleError(res, error);
	}
};

export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		if(!email || !password) return res.sendStatus(400);
		
		const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
		if(!user) return res.sendStatus(404);
		
		if(user.authentication.password !== authentication(user.authentication.salt, password)) return res.sendStatus(403);

		res.status(200).json(user);
	} catch(error) {
		handleError(res, error);
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const userId = get(req, 'identity._id') as string;

		res.sendStatus(200);
	} catch(error) {
		handleError(res, error);
	}
};

export const status = async (req: Request, res: Response) => {
	try {
		const user = get(req, 'identity') as string;

		res.status(200).json(user);
	} catch(error) {
		handleError(res, error);
	}
};