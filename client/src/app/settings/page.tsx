'use client'

import api from "@/helpers/api";
import { useUser } from '@/helpers/authentication/context';
import { useAuthHelpers } from "@/helpers/authentication/actions";
import { useRef } from "react";

export default function PostPage() {
	const { user, setUser } = useUser();
	const { logout } = useAuthHelpers();

const emailFormRef = useRef<HTMLFormElement>(null);
const usernameFormRef = useRef<HTMLFormElement>(null);

const changeEmail = (event: React.FormEvent<HTMLFormElement>) => {
	event.preventDefault();
	const formData = new FormData(event.currentTarget);
	api.patch(`/users/${user?._id}`, { email: formData.get('email') })
		.then(response => {
			setUser(response.data);
			emailFormRef.current?.reset();
		}).catch(error => console.log(error));
}
	
	const changeUsername = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		api.patch(`/users/${user?._id}`, { username: formData.get('username') })
			.then(response => {
				setUser(response.data)
				usernameFormRef.current?.reset();
			}).catch(error => console.log(error));
	}

	return (<>
		{ user ? (
			<div className='text-center flex flex-col gap-5'>
				<div className="flex flex-col gap-3">
					<label htmlFor="">change email ({user.email})</label>
					<form ref={emailFormRef} onSubmit={changeEmail} className='flex'>
						<input type="email" name='email' placeholder='email' required className='p-3 bg-transparent border border-foreground grow'/>
						<input type="submit" className='p-3 bg-transparent border border-foreground' value="submit" />
					</form>
				</div>
				<div className="flex flex-col gap-3">
					<label htmlFor="">change username ({user.username})</label>
					<form ref={usernameFormRef} onSubmit={changeUsername} className='flex'>
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