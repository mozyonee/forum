import express from 'express';
import { getUser, searchUsers, getUsersPosts, getUsersReplies, getUsersReposts, getUsersLikes, follow, changeEmail, changeUsername, deleteUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
	router.get('/users', getUser);
	router.get('/users/search', searchUsers);
	router.get('/users/posts', getUsersPosts);
	router.get('/users/replies', getUsersReplies);
	router.get('/users/reposts', getUsersReposts);
	router.get('/users/likes', getUsersLikes);

	router.patch('/users/follow', follow)
	router.patch('/users/email', changeEmail);
	router.patch('/users/username', changeUsername);
	
	router.delete('/users', deleteUser);
};
