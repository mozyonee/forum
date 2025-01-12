import express from 'express';
import { getPosts, getParents, getReplies, searchPosts, create, remove, like, repost } from '../controllers/posts';

export default (router: express.Router) => {
	router.get('/posts', getPosts);
	router.get('/posts/parents', getParents);
	router.get('/posts/replies', getReplies);
	router.get('/posts/search', searchPosts);

	router.post('/posts', create);
	router.patch('/posts/like', like);
	router.patch('/posts/repost', repost);

	router.delete('/posts', remove);
};