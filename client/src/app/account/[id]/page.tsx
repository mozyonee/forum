'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation';
import { useUser } from '@/helpers/authentication/context';
import api from '@/helpers/api';
import PostComponent from '@/components/Post';
import { User, Post } from '@/types/interfaces';

export default function Account() {
	const params = useParams();
	const { id } = params;
	const { user, setUser } = useUser();

	const [account, setAccount] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [selected, setSelected] = useState('posts');

	useEffect(() => {
		api.get(`/users?user=${id}`)
			.then(response => setAccount(response.data))
			.catch(error => console.log(error));
	}, []);

	useEffect(() => {
		api.get(`/users/${selected}?user=${id}`)
			.then(response => setPosts(response.data))
			.catch(error => console.log(error));
		
	}, [selected]);

	const follow = () => {
		api.patch(`/users/follow`, { follower: user, followed: account })
			.then(response => setUser(response.data))
			.catch(error => console.log(error));
	}

	return <>
		{account ? (<>
			<div className='text-center'>
				<h1>{account.username}</h1>

				{ (user && user._id !== account._id) && <button onClick={follow} className={`${user.following?.includes(account._id) && 'text-blue-400'}`}>follow</button> }
			</div>

			<div>
				<div className='flex justify-center gap-5'>
					<a onClick={() => setSelected('posts')} className={`${selected === 'posts' && 'text-gray-500'}`}>posts</a>
					<a onClick={() => setSelected('replies')} className={`${selected === 'replies' && 'text-gray-500'}`}>replies</a>
					<a onClick={() => setSelected('reposts')} className={`${selected === 'reposts' && 'text-gray-500'}`}>reposts</a>
					{ (user && user._id === account._id) && <a onClick={() => setSelected('likes')} className={`${selected === 'likes' && 'text-gray-500'}`}>likes</a> }
				</div>
				<div>
					{ posts.length ? 
						[...posts].reverse().map((post, key) => <PostComponent post={post} setParents={setPosts} key={key} />)
						:
						<p className='text-center'>no posts found</p>
					}
				</div>
			</div>
		</>) : (
			<h1>no account fount</h1>
		)}

	</>;
}