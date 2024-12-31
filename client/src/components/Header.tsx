'use client'

import { usePathname } from 'next/navigation'
import { useUser } from "@/helpers/authentication/context";
import Link from "next/link";

const Header = () => {

	const { user } = useUser();
	
	const path = usePathname().split('/');
	console.log(path);

	return (
		 <header className={`flex p-6 ${!user && path[path.length - 1] === 'authenticate' ? 'justify-center' : 'justify-between'} items-center gap-5`}>
			<nav className="flex gap-5">
				{ path[1] && <Link href='/' className="border border-foreground p-2">home</Link> }
				<a href="/search" className="border border-foreground p-2">search</a>
			</nav>
			{ user ?
				<nav className="flex gap-5">
					

					{ (path[path.length - 2] === 'account' && path[path.length - 1] === user._id) ? 
						<a href={`/settings`} className="border border-foreground p-2">settings</a>
					:
						<a href={`/account/${user._id}`} className="border border-foreground p-2">{user.username}</a>
					}
				</nav>
			: <>
				{ path[path.length - 1] !== 'authenticate' &&
					<nav className="flex">
						<a href="/authenticate" className="border border-foreground p-2">authenticate</a>
					</nav>
				}
			</>}
		</header>
	);
}

export default Header;