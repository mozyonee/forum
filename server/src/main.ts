import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.useLogger(new Logger());

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	)

	app.enableCors({
		"origin": [configService.get<string>('CLIENT_URL')],
		"methods": "GET,POST,PATCH,DELETE",
		credentials: true,
		allowedHeaders: ['Content-Type', 'Accept'],
		"preflightContinue": false,
		"optionsSuccessStatus": 204
	});

	app.setGlobalPrefix('v1');

	await app.listen(8080);
}

bootstrap();