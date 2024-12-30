'use client'

import api from "@/helpers/api";
import { useUser } from "@/helpers/authentication/context";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { Post } from '@/types/interfaces';
import { format } from 'date-fns';

interface PostFunction {
	post: Post;
	setParent?: React.Dispatch<React.SetStateAction<Post | null>>;
	setParents?: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostComponent: React.FC<PostFunction> = ({ post, setParent = null, setParents = null }) => {
	const { user } = useUser();
	const router = useRouter();

	const like = () => {
		api.patch('/posts/like', { user, post })
			.then(response => {
				if (setParent !== null) setParent(response.data);
				if (setParents !== null) setParents((prevPosts: Post[]) => {
					return prevPosts.map((prevPost) => {
						if (prevPost._id === post._id) return response.data;
						return prevPost;
					});
				});
			})
			.catch(error => console.log(error));
	}
	const repost = () => {
		api.patch('/posts/repost', { user, post })
			.then(response => {
				if (setParent !== null) setParent(response.data);
				if (setParents !== null) setParents((prevPosts: Post[]) => {
					return prevPosts.map((prevPost) => {
						if (prevPost._id === post._id) return response.data;
						return prevPost;
					});
				});
			})
			.catch(error => console.log(error));
	}
	const share = () => {
		navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`)
			.then((response) => console.log(response))
			.catch(error => console.error(error));
	}
	const remove = () => {
		api.delete('/posts', { data: { user: user?._id, post: post._id } })
			.then(response => {
				if (setParent !== null) {
					setParent((prevPost: Post | null) => {
						if (prevPost && prevPost._id === post._id) {
							setTimeout(() => {
								if (prevPost.parent) {
									router.push(`/post/${prevPost.parent}`);
								} else {
									router.push('/');
								}
							}, 0);
							return null;
						}
						return prevPost;
					});
				} else if (setParents !== null) {
					setParents((prevPosts: Post[]) => {
						return prevPosts.filter((post: Post) => post._id !== response.data);
					});
				}
			})
			.catch(error => console.log(error));
	};

	const [innerHover, hoverInner] = useState(false);
	const [outerHover, hoverOuter] = useState(false);

	const blockLink = () => {
		if (!innerHover) router.push(`/post/${post._id}`);
	};
	
	return (
		<div className='border border-foreground p-3 cursor-pointer' onClick={blockLink} onMouseEnter={() => hoverOuter(true)} onMouseLeave={() => hoverOuter(false)}>
			<div className="flex gap-3 justify-between">
				<a href={`/account/${post.author?._id}`} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>{post.author?.username}</a>
				<p>{format(new Date(post.date), 'HH:mm, dd/MM/yyyy')}</p>
			</div>

			<p className={`${(outerHover && !innerHover) && 'opacity-50'}`} style={{ transition: 'opacity 0.25s ease-in-out' }} >{post.text}</p>

			{user && (
				<div className="flex gap-3 justify-between">
					<div className="flex gap-3">
						<button className={`${post.likes.includes(user._id) && 'text-like'}`}
							onClick={like} onMouseEnter={() => hoverInner(true)}	onMouseLeave={() => hoverInner(false)}>
							like
						</button>
						<button className={`${post.reposts.includes(user._id) && 'text-repost'}`}
							onClick={repost} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>
							repost
						</button>
						<button	onClick={share} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>share</button>
					</div>
					{user && user._id === post.author?._id && <button onClick={remove} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)} >delete</button>}
				</div>
			)}
		</div>
	);
};

export default PostComponent;
