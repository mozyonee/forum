
'use server'
'server-only'

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { User } from '@/types/interfaces';

const cookie = {
	name: 'session',
	options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
	duration: 24 * 60 * 60 * 1000
} as const;

const key = 'zujotnjscdktsuda';

export async function encrypt(payload: any) {
	return new SignJWT(payload).setProtectedHeader({ alg: 'HS256'}).setIssuedAt().setExpirationTime('1day').sign(new TextEncoder().encode(key));
}

export async function decrypt(session: string) {
    try {
        const { payload } = await jwtVerify(session, new TextEncoder().encode(key), { algorithms: ['HS256'], });
        return payload;
    } catch (error) {
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

    const payload = await decrypt(token) as unknown;
    const user = payload as User;
    
    return user || null;
}

export async function deleteSession() {
	(await cookies()).delete(cookie.name);
}