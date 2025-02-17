import { Body, Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserDto } from '../users/define/user.dto';
import { PostDto } from './define/post.dto';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) { }

	@Get('parents') // GET /posts?parent=string
	getParents(@Query('parent') parent: string | null) {
		return this.postsService.getParents(parent);
	}

	@Get('replies') // GET /posts/replies?parent=string
	getReplies(@Query('parent') parent: string | null) {
		return this.postsService.getReplies(parent);
	}

	@Get('search') // GET /posts/search?query=string
	searchPosts(@Query('query') query: string) {
		return this.postsService.searchPosts(query);
	}

	@Post() // POST /posts
	createPost(@Body() body: { author: string, text: string, attachments: string[]; }) {
		return this.postsService.createPost(body);
	}

	@Patch('like') // PATCH /posts/like
	likePost(@Body() body: { user: UserDto, post: PostDto; }) {
		return this.postsService.likePost(body);
	}

	@Patch('repost') // PATCH /posts/repost
	repostPost(@Body() body: { user: UserDto, post: PostDto; }) {
		return this.postsService.repostPost(body);
	}

	@Delete() // DELETE /posts
	deletePost(@Body() body: { post: string; }) {
		return this.postsService.deletePost(body);
	}

}
