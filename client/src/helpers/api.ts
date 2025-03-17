import axios from 'axios';

const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/v1`,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
});

export default api;