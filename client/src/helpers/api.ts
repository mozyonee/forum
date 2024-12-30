import axios from 'axios';

const api = axios.create({
	baseURL: process.env.SERVER_URL + '/v1',
	headers: { "Access-Control-Allow-Origin": "*" },
	withCredentials: true
});

export default api;