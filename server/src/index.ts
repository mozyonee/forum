require('dotenv').config();
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import path from 'path';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);
const { SERVER_HOST, SERVER_PORT } = process.env;

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open', () => {
	server.listen(SERVER_PORT, () => {
		console.log(`server listened on ${SERVER_HOST}:${SERVER_PORT}`);
	})
});
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/v1', router());