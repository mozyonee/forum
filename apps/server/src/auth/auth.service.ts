import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from '../users/define/user.dto';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly authSecret: string;

  constructor(
    @InjectModel('User') private readonly userModel: mongoose.Model<UserDto>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.authSecret = this.configService.get<string>('JWT_SECRET');
  }

  random = () => crypto.randomBytes(128).toString('base64');
  authentication = (salt: string, password: string) =>
    crypto
      .createHmac('sha256', [salt, password].join('/'))
      .update(this.authSecret || 'secret')
      .digest('hex');

  async register(body: { email: string; password: string; username: string }) {
    const { email, password, username } = body;

    if (!email || !password || !username)
      throw new BadRequestException('Bad Request');

    const existingEmail = await this.userModel.findOne({ email });
    const existingUsername = await this.userModel.findOne({ username });

    if (existingEmail || existingUsername)
      throw new BadRequestException('Bad Request');

    const salt = this.random();
    const user = await this.userModel.create({
      email,
      username,
      authentication: {
        salt,
        password: this.authentication(salt, password),
      },
    });

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      following: user.following,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  async me(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      return null;
    }
  }

  async login(body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password)
      throw new BadRequestException('No Email or Password Provided');

    const user = (await this.userModel
      .findOne({ email })
      .select('+authentication.salt +authentication.password')) as UserDto;

    if (!user) throw new NotFoundException('User Not Found');
    if (
      user.authentication.password !==
      this.authentication(user.authentication.salt, password)
    )
      throw new ForbiddenException('Wrong Password');

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      following: user.following,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }
}
