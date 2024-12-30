'use client'

import { useState, useEffect } from 'react';
import api from "@/helpers/api";

import PostComponent from '@/components/Post';

import { User, Post } from '@/types/interfaces';

const Search = () => {
	const [accounts, setAccounts] = useState<User[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [selected, setSelected] = useState('accounts');
	const [text, setText] = useState('');

	useEffect(() => {
		if (text) {
			if (selected === 'accounts') {
				api.get(`/users/search?query=${text}`)
					.then(response => setAccounts(response.data))
					.catch(error => console.log(error));
			} else if (selected === 'posts') {
				api.get(`/posts/search?query=${text}`)
					.then(response => setPosts(response.data))
					.catch(error => console.log(error));
			}
		} else {
			setAccounts([]);
			setPosts([]);
		}
	}, [text, selected]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	return (
		<>
			<div className='flex justify-center gap-5'>
				<a onClick={() => setSelected('accounts')} className={`${selected === 'accounts' && 'text-neutral-500'}`}>accounts</a>
				<a onClick={() => setSelected('posts')} className={`${selected === 'posts' && 'text-neutral-500'}`}>posts</a>
			</div>

			<input type="text" className="w-full bg-transparent border border-white p-3" placeholder="search" value={text} onChange={handleChange} />

			{(accounts && selected === 'accounts') &&
				accounts.map((account, key) => (
					<a href={`/account/${account._id}`} className="border border-white p-3 block" key={key}>{account.username}</a>
				))
			}

			{(posts && selected === 'posts') &&
				posts.map((post, key) => (
					<PostComponent post={post} setParents={setPosts} key={key} />
				))
			}

			{(text && ((selected === 'accounts' && !accounts.length) || (selected === 'posts' && !posts.length))) && <p className='text-center'>No results found</p>}
		</>
	);
}

export default Search;