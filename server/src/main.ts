import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const clientHost = configService.get<string>('CLIENT_HOST') || "http://localhost";
	const clientPort = clientHost === "http://localhost" ? `:${configService.get<string>('CLIENT_PORT')}` : "";
	const clientURL = clientHost + clientPort;

	app.enableCors({
		"origin": [clientURL],
		"methods": "GET,POST,PATCH,DELETE",
		credentials: true,
		allowedHeaders: ['Content-Type', 'Accept'],
		"preflightContinue": false,
		"optionsSuccessStatus": 204
	});

	app.useLogger(new Logger());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	);

	app.setGlobalPrefix('v1');

	await app.listen(configService.get<number>('SERVER_PORT') || 8080, '0.0.0.0');
}

bootstrap();