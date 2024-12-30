'use client'

import { useState, useEffect } from 'react';
import api from "@/helpers/api";
import PostComponent from '@/components/Post';
import Input from '@/components/Input';
import { useParams } from 'next/navigation';
import { Post } from '@/types/interfaces';

export default function PostPage() {
	const params = useParams();
	const id = params.id?.toString() || null;

	const [post, setPost] = useState<Post | null>(null);
	const [replies, setReplies] = useState<Post[]>([]);

	useEffect(() => {
		const fetchPost = async () => {
			await api.get(`/posts?parent=${id}`)
				.then(response => setPost(response.data))
				.catch(error => console.log(error));

			await api.get(`/posts/replies?parent=${id}`)
				.then(response => setReplies(response.data))
				.catch(error => console.log(error));
		};
		fetchPost();
	}, [id]);

	return (
		<>
			{post ? (
				<>
					<PostComponent post={post} setParent={setPost} />
					<Input parent={id} setParent={setReplies} />
					<div>
						{[...replies].reverse().map((reply, key) => <PostComponent post={reply} setParents={setReplies} key={key} />)}
					</div>
				</>
			) : (
				<h1>post not found</h1>
			)}
		</>
	);
}
