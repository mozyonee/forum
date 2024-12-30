'use client'

import api from "@/helpers/api";
import { useUser } from '@/helpers/authentication/context';

export default function PostPage() {
	const { user, setUser } = useUser();

	const changeEmail = (input: FormData) => {
		api.patch('/users/email', { user: user?._id, email: input.get('email') })
			.then(response => setUser(response.data))
			.catch(error => console.log(error));
	}
	
	const changeUsername = (input: FormData) => {
		api.patch('/users/username', { user: user?._id, username: input.get('username') })
			.then(response => setUser(response.data))
			.catch(error => console.log(error));
	}

	return (<>
		{ user ? (
			<div className='text-center'>
				<label htmlFor="">change email ({user.email})</label>
				<form action={changeEmail} className='flex'>
					<input type="email" name='email' placeholder='email' required className='p-3 bg-transparent border border-white grow'/>
					<input type="submit" className='p-3 bg-transparent border border-white' />
				</form>
				<label htmlFor="">change username ({user.username})</label>
				<form action={changeUsername} className='flex'>
					<input type="text" name='username' placeholder='username' required className='p-3 bg-transparent border border-white grow'/>
					<input type="submit" className='p-3 bg-transparent border border-white' />
				</form>
			</div>
		) : (
			<p>no access</p>
		) }
	</>);
}