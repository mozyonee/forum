import express from 'express';
import { register, login, status, logout } from '../controllers/authentication';
import { isAuthenticated } from '../middlewares';

export default (router: express.Router) => {
	router.post('/auth/register', register);
	router.post('/auth/login', login);
	router.post('/auth/logout', isAuthenticated, logout);
	router.get('/auth/status', isAuthenticated, status);
};