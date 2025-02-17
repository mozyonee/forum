import axios from 'axios';

const api = axios.create({
	baseURL: `${process.env.SERVER_URL || 'http://localhost:8080'}/v1`,
	withCredentials: true
});

export default api;