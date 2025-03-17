import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', configService.get<string>('CLIENT_URL'));
		res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
		next();
	});

	app.enableCors({
		allowedHeaders: "*",
		origin: configService.get<string>('CLIENT_URL'),
		credentials: true
	});

	// app.enableCors({
	// 	origin: true,
	// 	credentials: true,
	// 	methods: "GET,POST,PATCH,DELETE",
	// 	allowedHeaders: ["Content-Type", "Accept", 'Authorization']
	// });

	app.useLogger(new Logger());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);

	app.setGlobalPrefix('v1');

	await app.listen(8080, '0.0.0.0');
}

bootstrap();