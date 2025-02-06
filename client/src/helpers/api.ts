import axios from 'axios';

const host = process.env.SERVER_HOST || "http://localhost"
const port = ((host == "http://localhost" || host == "http://127.0.0.1") && process.env.SERVER_PORT) ? `:${process.env.SERVER_PORT}` : "";


const api = axios.create({
	baseURL: (host + port + '/v1'),
	withCredentials: true
});

export default api;