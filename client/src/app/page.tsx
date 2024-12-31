'use client'

import { useState, useEffect } from 'react';
import api from "@/helpers/api";
import PostComponent from '@/components/Post';
import Input from '@/components/Input';

import { Post } from '@/types/interfaces';

const Home = () => {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		api.get(`/posts/replies?parent`)
			.then(response => setPosts(response.data))
			.catch(error => console.error(error));
	}, []);

	return (
		<>
			<Input parent={null} setParent={setPosts} />
			<div>
				{[...posts].reverse().map((post, key) => (
					<PostComponent post={post} setParents={setPosts} key={key} />
				))}
			</div>
		</>
	);
}

export default Home;