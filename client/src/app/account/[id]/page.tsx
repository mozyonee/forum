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
	const [followers, setFollowers] = useState<string[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [selected, setSelected] = useState('posts');

	useEffect(() => {
		api.get(`/users?user=${id}`)
			.then(response => setAccount(response.data))
			.catch(error => console.log(error));
		api.get(`/users/followers?user=${id}`)
			.then(response => setFollowers(response.data))
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
				<h1 className='text-3xl font-bold'>{account.username}</h1>

				<p className='my-2'>{account.following.length} following, {followers.length} followers</p>

				{ (user && user._id !== account._id) &&
					<button onClick={follow} className={`${user.following?.includes(account._id) && 'text-follow'}`}>follow{user.following?.includes(account._id) &&  'ing'}</button>
				}
			</div>

			<div>
				<div className='flex justify-center gap-5 my-5'>
					<a onClick={() => setSelected('posts')} className={`${selected === 'posts' && 'opacity-50'}`}>posts</a>
					<a onClick={() => setSelected('replies')} className={`${selected === 'replies' && 'opacity-50'}`}>replies</a>
					<a onClick={() => setSelected('reposts')} className={`${selected === 'reposts' && 'opacity-50'}`}>reposts</a>
					{ (user && user._id === account._id) && <a onClick={() => setSelected('likes')} className={`${selected === 'likes' && 'opacity-50'}`}>likes</a> }
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