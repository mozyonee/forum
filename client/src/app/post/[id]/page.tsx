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

	const [posts, setPosts] = useState<Post[]>([]);
	const [replies, setReplies] = useState<Post[]>([]);

	useEffect(() => {
		const fetchPost = async () => {
			await api.get(`/posts/parents?parent=${id}`)
				.then(response => setPosts(response.data))
				.catch(error => console.log(error));

			await api.get(`/posts/replies?parent=${id}`)
				.then(response => setReplies(response.data))
				.catch(error => console.log(error));
		};
		fetchPost();
	}, [id]);

	useEffect(()=>{
		api.get(`/posts/parents?parent=${id}`)
			.then(response => setPosts(response.data))
			.catch(error => console.log(error));
	}, [replies, id])

	return (
		<>
			{posts ? (
				<>
					<div>
						{[...posts].reverse().map((post, key) => <PostComponent post={post} setParents={setPosts} key={key} />)}
					</div>
					<Input parent={id} setParent={setReplies} />
					<div>
						{[...replies].reverse().map((reply, key) => <PostComponent post={reply} setParents={setReplies} key={key} />)}
					</div>
				</>
			) : (
				<p className="text-center">post not found</p>
			)}
		</>
	);
}
