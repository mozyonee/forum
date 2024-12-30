import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import { decrypt } from '@/helpers/authentication/session';

export default async function middleware(req: NextRequest) {
	const protectedGuests = ['/settings'];
	const protectedUsers = ['/authenticate'];
	const currentPath = req.nextUrl.pathname;
	
	const token = (await cookies()).get('session')?.value;
	const session = token ? await decrypt(token) : null;

	if(protectedUsers.includes(currentPath) && session) return NextResponse.redirect(new URL('/', req.nextUrl));
	if(protectedGuests.includes(currentPath) && !session) return NextResponse.redirect(new URL('/authenticate', req.nextUrl));

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image).*)']
}