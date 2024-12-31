import express from 'express';
import  { get, merge } from 'lodash';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		// const sessionToken = req.cookies['session'];
		// if(!sessionToken) return res.sendStatus(403);
		// const existingUser = await getUserBySessitokenonToken(sessionToken);
		// if(!existingUser) return res.sendStatus(403);

		// merge(req, {identity: existingUser})

		return next();
	} catch(error) {
		console.log(error);
		return res.sendStatus(500);
	}
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const { user } = req.body;
		const currentUserId = get(req, 'identity._id') as string;
		if(!currentUserId) return res.sendStatus(400);
		if(currentUserId.toString() !== user) return res.sendStatus(403);
		return next();
	} catch(error) {
		console.log(error);
		return res.sendStatus(500);
	}
}