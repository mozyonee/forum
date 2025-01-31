import { Body, Controller, Logger, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, UpdateUserDto } from './define/user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }


    @Get() // GET /users or /users?user=string
    getUser(@Query('user') user?: string) {
        return this.usersService.getUser(user);
    }

    @Get('search') // GET /users/search?query=string
    searchUsers(@Query('query') query: string) {
        return this.usersService.searchUsers(query);
    }

    @Get('posts') // GET /users/posts?user=string
    getUsersPosts(@Query('user') user: string) {
        return this.usersService.getUsersPosts(user);
    }

    @Get('replies') // GET /users/replies?user=string
    getUsersReplies(@Query('user') user: string) {
        return this.usersService.getUsersReplies(user);
    }

    @Get('reposts') // GET /users/reposts?user=string
    getUsersReposts(@Query('user') user: string) {
        return this.usersService.getUsersReposts(user);
    }

    @Get('likes') // GET /users/likes?user=string
    getUsersLikes(@Query('user') user: string) {
        return this.usersService.getUsersLikes(user);
    }

    @Get('followers') // GET /users/followers?user=string
    getUsersFollowers(@Query('user') user: string) {
        return this.usersService.getUsersFollowers(user);
    }

    @Patch('follow') // PATCH /users/follow
    followUser(@Body() body: { follower: UserDto, followed: UserDto }) {
        console.log('followUser', body);
        return this.usersService.followUser(body);
    }

    @Patch(':id') // PATCH /users/:id
    updateUser(@Param('id') id: string, @Body() user: { email?: string, username?: string }) {
        return this.usersService.updateUser(id, user);
    }

    @Delete(':id') // DELETE /users/:id
    deleteUser(@Param('id') id: string) {
        return this.usersService.deleteUser(id);
    }

}
