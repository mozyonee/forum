'use client'

import api from "@/helpers/api";
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthHelpers } from "@/helpers/authentication/actions";
import { useUser } from "@/helpers/authentication/context";
import Link from "next/link";

const Header = () => {
	
	const { user } = useUser();
	const { logout } = useAuthHelpers();
	
	
	const [parent, setParent] = useState('');
	const path = usePathname().split('/');

	useEffect(() => {
		if(path[path.length - 2] === 'post') {
			api.get(`/posts?parent=${path[path.length - 1]}`)
			.then(response => setParent(response.data.parent))
			.catch(error => console.log(error));
		}
	});

	return (
		 <header className="flex p-6 justify-between items-center gap-5">
			<nav className="flex gap-5">
				<Link href='/' className="border border-white p-2">home</Link>
				{ parent &&
					<a href={`/post/${parent}`} className="border border-white p-2">back</a>
				}
				<a href="/search" className="border border-white p-2">search</a>
			</nav>
			{ user ?
				<nav className="flex gap-5">
					<a onClick={logout} className="border border-white p-2">sign out</a>

					{ (path[path.length - 2] === 'account' && path[path.length - 1] === user._id) ? 
						<a href={`/settings`} className="border border-white p-2">settings</a>
					:
						<a href={`/account/${user._id}`} className="border border-white p-2">{user.username}</a>
					}
				</nav>
			: <>
				{ path[path.length - 1] !== 'authenticate' &&
					<nav>
						<a href="/authenticate" className="border border-white p-2">authenticate</a>
					</nav>
				}
			</>}
		</header>
	);
}

export default Header;