'use client'
import { useAuthHelpers } from "@/helpers/authentication/actions";

import { useState, useEffect } from 'react';
import api from "@/helpers/api";
import PostComponent from '@/components/Post';
import Input from '@/components/Input';
import { useParams } from 'next/navigation';
import { Post } from '@/types/interfaces';

export default function PostPage() {
	const { register, login, logout, verify } = useAuthHelpers();


	return (
		<div className="text-center flex flex-col gap-10">
			<form action={register} className="flex flex-col">
				<input type="text" name="username" placeholder="username" required className="border border-white bg-transparent p-2" />
				<input type="text" name="email" placeholder="email" required className="border border-white bg-transparent p-2" />
				<input type="text" name="password" placeholder="password" required className="border border-white bg-transparent p-2" />
				<input type="submit" className="border border-white p-2" value="sign up" />
			</form>
			<form action={login} className="flex flex-col">
				<input type="text" name="email" placeholder="email" required className="border border-white bg-transparent p-2" />
				<input type="text" name="password" placeholder="password" required className="border border-white bg-transparent p-2" />
				<input type="submit" className="border border-white p-2" value="log in" />
			</form>
		</div>
	);
}
