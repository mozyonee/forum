import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postSchema } from './define/post.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Post', schema: postSchema }])
	],
	providers: [PostsService],
	controllers: [PostsController]
})
export class PostsModule { }
