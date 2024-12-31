'use client'

import api from "@/helpers/api";
import { useUser } from '@/helpers/authentication/context';
import { useAuthHelpers } from "@/helpers/authentication/actions";

export default function PostPage() {
	const { user, setUser } = useUser();
	const { logout } = useAuthHelpers();

	const changeEmail = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		api.patch('/users/email', { user: user?._id, email: formData.get('email') })
			.then(response => {
				setUser(response.data);
				event.currentTarget.reset();
			}).catch(error => console.log(error));
	}
	
	const changeUsername = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		api.patch('/users/username', { user: user?._id, username: formData.get('username') })
			.then(response => {
				setUser(response.data)
				event.currentTarget.reset();
			}).catch(error => console.log(error));
	}

	return (<>
		{ user ? (
			<div className='text-center flex flex-col gap-5'>
				<div className="flex flex-col gap-3">
					<label htmlFor="">change email ({user.email})</label>
					<form onSubmit={changeEmail} className='flex'>
						<input type="email" name='email' placeholder='email' required className='p-3 bg-transparent border border-foreground grow'/>
						<input type="submit" className='p-3 bg-transparent border border-foreground' value="submit" />
					</form>
				</div>
				<div className="flex flex-col gap-3">
					<label htmlFor="">change username ({user.username})</label>
					<form onSubmit={changeUsername} className='flex'>
						<input type="text" name='username' placeholder='username' required className='p-3 bg-transparent border border-foreground grow'/>
						<input type="submit" className='p-3 bg-transparent border border-foreground' value="submit" />
					</form>
				</div>
				<a onClick={logout} className="border border-foreground p-2 mt-10">sign out</a>
			</div>
		) : (
			<p>no access</p>
		) }
	</>);
}