'use server';
'server-only';

import { cookies } from 'next/headers';
import axios from 'axios';
import { User } from '@/types/interfaces';

const cookie = {
	name: 'session',
	options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
	duration: 24 * 60 * 60 * 1000,
} as const;

export async function createSession(token: string) {
	const expires = new Date(Date.now() + cookie.duration);
	(await cookies()).set(cookie.name, token, { ...cookie.options, expires });
}

export async function verifySession(): Promise<User | null> {
	const token = (await cookies()).get(cookie.name)?.value;
	if (!token) return null;
	try {
		const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return res.data;
	} catch {
		return null;
	}
}

export async function deleteSession() {
	(await cookies()).delete(cookie.name);
}
