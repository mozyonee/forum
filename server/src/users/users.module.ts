import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './define/user.model';
import { postSchema } from 'src/posts/define/post.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Post', schema: postSchema }]),
        MongooseModule.forFeature([{ name: 'User', schema: userSchema }])
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule { }
