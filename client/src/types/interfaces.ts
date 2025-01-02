interface User {
    _id: string;
    email: string;
    username: string;
	following: string[];
}

interface Post {
	_id: string;
	parent: string | null;
	date: Date;
	author: User;
	text: string;
	attachments: string[];
	likes: string[];
	reposts: string[];
	repliesCount: number;
}

export type { User, Post }