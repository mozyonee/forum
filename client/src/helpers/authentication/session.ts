
'use server'
'server-only'

import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { User } from '@/types/interfaces';

const cookie = {
	name: 'session',
	options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
	duration: 24 * 60 * 60 * 1000
} as const;

const key = process.env.SESSION_SECRET!;

export async function encrypt(user: User) {

    const buffer = user as unknown;
    const payload = buffer as JWTPayload;

	return new SignJWT(payload).setProtectedHeader({ alg: 'HS256'}).setIssuedAt().setExpirationTime('1day').sign(new TextEncoder().encode(key));
}

export async function decrypt(session: string) {
    try {
        const { payload } = await jwtVerify(session, new TextEncoder().encode(key), { algorithms: ['HS256'], });

        const buffer = payload as unknown;
        const user = buffer as User;

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function createSession(user: User) {
	const expires = new Date(Date.now() + cookie.duration);


	const session = await encrypt(user);
	
	(await cookies()).set(cookie.name, session, { ...cookie.options, expires });
}

export async function verifySession() {
    const token = (await cookies()).get(cookie.name)?.value || '';
    if (!token) return null;

    const user = await decrypt(token);

    return user || null;
}

export async function deleteSession() {
	(await cookies()).delete(cookie.name);
}