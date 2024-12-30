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
	likes: string[];
	reposts: string[];
}

export type { User, Post }