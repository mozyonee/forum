require('dotenv').config();
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import { Server } from 'socket.io';
import api from './helpers/api';

const app = express();

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));

app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const { SERVER_HOST, SERVER_PORT } = process.env;
const io = new Server(server, {
	cors: {
		origin: [process.env.CLIENT_URL, process.env.SERVER_URL],
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true
	}
});

io.on('connection', socket => {
	socket.on('register', data => {
		api.post('/auth/register', data)
			.then(response => {
				socket.emit('registerDisplay', response)
			})
			.catch(error => {
				console.log(error);
			});
	})
});

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => {
	server.listen(SERVER_PORT, () => {
		console.log(`server listened on ${SERVER_HOST}:${SERVER_PORT}`);
	})
});

mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/v1', router());