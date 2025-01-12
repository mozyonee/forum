require('dotenv').config();
import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import routerV1 from './routerV1';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (origin === process.env.CLIENT_URL) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Access-Control-Allow-Credentials", "true");
		return next();
	}
	res.sendStatus(403);
});
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

app.use('/v1', routerV1());