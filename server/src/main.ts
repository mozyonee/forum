import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.enableCors({
		origin: true,
		credentials: true,
		methods: "GET,POST,PATCH,DELETE",
		allowedHeaders: ["Content-Type", "Accept", 'Authorization']
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

	await app.listen(8080, '0.0.0.0');
}

bootstrap();