import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { userSchema } from 'src/users/define/user.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'User', schema: userSchema }])
	],
	providers: [AuthService],
	controllers: [AuthController]
})
export class AuthModule { }