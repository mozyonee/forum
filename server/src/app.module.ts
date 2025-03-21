import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import mongoose from 'mongoose';

mongoose.set('debug', true);

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return ({
					uri: configService.get<string>('MONGODB_URI')
				});
			},
			inject: [ConfigService]
		}),
		UsersModule,
		ThrottlerModule.forRoot([{ ttl: 1000, limit: 3 }]),
		PostsModule,
		AuthModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	],
	exports: []
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// consumer.apply(CorsMiddleware).forRoutes('*'); // Apply to all routes
	}

}
