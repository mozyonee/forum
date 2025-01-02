'use client'

import api from "@/helpers/api";
import { useUser } from "@/helpers/authentication/context";
import { usePathname, useRouter } from 'next/navigation'
import { useState } from "react";
import { Post } from '@/types/interfaces';
import { format } from 'date-fns';
import { CommentIcon, LikeIcon, RepostIcon, ShareIcon, DeleteIcon } from "../../public/icons";

interface PostFunction {
	post: Post;
	setParents: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostComponent: React.FC<PostFunction> = ({ post, setParents }) => {
	const { user } = useUser();
	const router = useRouter();
	const path = usePathname().split('/');

	const like = () => {
		if(!user) return router.push('/authenticate');

		api.patch('/posts/like', { user, post })
			.then(response => {
				setParents((prevPosts: Post[]) => {
					return prevPosts.map((prevPost) => {
						if (prevPost._id === post._id) return response.data;
						return prevPost;
					});
				});
			})
			.catch(error => console.log(error));
	}
	const repost = () => {
		if(!user) return router.push('/authenticate');
		
		api.patch('/posts/repost', { user, post })
			.then(response => {
				setParents((prevPosts: Post[]) => {
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
					if(path[path.length - 2] === 'post' && path[path.length - 1] === post._id) {
						if (post.parent) router.push(`/post/${post.parent}`);
						else router.push('/');
					} else {
						setParents((prevPosts: Post[]) => {
							return prevPosts.filter((post: Post) => post._id !== response.data);
						});
					}
			}).catch(error => console.log(error));
	};

	const [innerHover, hoverInner] = useState(false);
	const [outerHover, hoverOuter] = useState(false);

	const blockLink = () => {
		router.push(`/post/${post._id}`);
	};

	return (
		<div className='border border-foreground p-3 cursor-pointer' onClick={blockLink} onMouseEnter={() => hoverOuter(true)} onMouseLeave={() => hoverOuter(false)}>
			<div className="flex gap-3 justify-between">
				<div className="flex gap-2 items-center">
					<a href={`/account/${post.author?._id}`} className="text-lg font-bold"  onClick={(event) => { event.stopPropagation(); }} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>{post.author?.username}</a>
					{ post.date && <p className="opacity-75 text-sm">{format(new Date(post.date), 'HH:mm, dd/MM/yyyy')}</p>}
				</div>
				
				{ user && user._id === post.author?._id &&
					<button onClick={(event) => { event.stopPropagation(); remove(); }} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>
						<DeleteIcon classNames="fill-foreground" />
					</button>
				}
			</div>

			<p className={`${(outerHover && !innerHover) && 'opacity-50'} text-base my-2`} style={{ transition: 'opacity 0.25s ease-in-out' }} >{post.text}</p>

			{post.attachments?.length > 0 && (
				<div className="grid grid-cols-2 gap-2 my-3">
					{post.attachments.map((image, key) => (
						<img key={key} src={image} alt={`Attachment ${key + 1}`} className="w-full h-auto border border-foreground rounded" onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}/>
					))}
				</div>
			)}

			<div className="flex gap-3 justify-between">
				<div className="flex gap-3">
					<button className="flex items-center gap-1" onClick={(event) => { event.stopPropagation(); like(); }} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>
						<LikeIcon classNames={`${user && post.likes?.includes(user._id) ? 'fill-like' : 'fill-foreground'}`} />
						<span>{post.likes?.length}</span>
					</button>
					<button className="flex items-center gap-1" onClick={(event) => { event.stopPropagation(); repost(); }} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>
						<RepostIcon classNames={`${user && post.reposts?.includes(user._id) ? 'fill-repost' : 'fill-foreground'}`} />
						<span>{post.reposts?.length}</span>
					</button>
					<button className="flex items-center gap-1" onClick={() => router.push(`/post/${post._id}`)} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>
						<CommentIcon classNames="fill-foreground" />
						<span>{post.repliesCount}</span>
					</button>
				</div>
				<button className="flex items-center gap-1"	onClick={(event) => { event.stopPropagation(); share(); }} onMouseEnter={() => hoverInner(true)} onMouseLeave={() => hoverInner(false)}>
					<ShareIcon classNames="fill-foreground" />
				</button>
			</div>
		</div>
	);
};

export default PostComponent;
