'use client'

import { useAuthHelpers } from "@/helpers/authentication/actions";

export default function PostPage() {
	const { register, login } = useAuthHelpers();

	return (
		<div className="text-center flex flex-col gap-10">
			<form action={register} className="flex flex-col">
				<input type="text" name="username" placeholder="username" required className="border border-foreground bg-transparent p-2" />
				<input type="text" name="email" placeholder="email" required className="border border-foreground bg-transparent p-2" />
				<input type="text" name="password" placeholder="password" required className="border border-foreground bg-transparent p-2" />
				<input type="submit" className="border border-foreground p-2" value="sign up" />
			</form>
			<form action={login} className="flex flex-col">
				<input type="text" name="email" placeholder="email" required className="border border-foreground bg-transparent p-2" />
				<input type="text" name="password" placeholder="password" required className="border border-foreground bg-transparent p-2" />
				<input type="submit" className="border border-foreground p-2" value="log in" />
			</form>
		</div>
	);
}
