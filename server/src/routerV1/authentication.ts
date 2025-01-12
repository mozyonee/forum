import express from 'express';
import { register, login, status, logout } from '../controllers/authentication';

export default (router: express.Router) => {
	router.post('/auth/register', register);
	router.post('/auth/login', login);
	router.post('/auth/logout', logout);
	router.get('/auth/status', status);
};