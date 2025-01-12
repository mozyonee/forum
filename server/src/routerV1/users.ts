import express from 'express';
import { getUser, searchUsers, getUsersPosts, getUsersFollowers, getUsersReplies, getUsersReposts, getUsersLikes, follow, changeEmail, changeUsername, deleteUser } from '../controllers/users';

export default (router: express.Router) => {
	router.get('/users', getUser);
	router.get('/users/search', searchUsers);
	router.get('/users/posts', getUsersPosts);
	router.get('/users/replies', getUsersReplies);
	router.get('/users/reposts', getUsersReposts);
	router.get('/users/likes', getUsersLikes);
	router.get('/users/followers', getUsersFollowers);

	router.patch('/users/follow', follow)
	router.patch('/users/email', changeEmail);
	router.patch('/users/username', changeUsername);
	
	router.delete('/users', deleteUser);
};
