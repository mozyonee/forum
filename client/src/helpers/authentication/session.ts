
'use server'
'server-only'

import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from '@/types/interfaces';

const cookie = {
	name: 'session',
	options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' },
	duration: 24 * 60 * 60 * 1000
} as const;

const secret = 'secret';

export async function encrypt(user: User) {
	return jwt.sign({ user }, secret, { algorithm: 'HS256', expiresIn: '1d' });
}

export async function decrypt(session: string): Promise<JwtPayload | null> {
    try {
        const decrypted = jwt.verify(session, secret);
        if (typeof decrypted === "object" && decrypted !== null) {
            return decrypted as JwtPayload;
        }
        return null;
    } catch (error) {
        console.error("Invalid or expired token:", error);
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

    const session = await decrypt(token);

	const user = session?.['user'];

    if(user) console.log('VERIFIED');
    else console.log('suck')

    return user || null;
}

  
export async function deleteSession() {
	(await cookies()).delete(cookie.name);
}