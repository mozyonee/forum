import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/helpers/authentication/session';

export default async function middleware(req: NextRequest) {
	const protectedGuests = ['/settings'];
	const protectedUsers = ['/authenticate'];
	const currentPath = req.nextUrl.pathname;

	const session = await verifySession();

	if (protectedUsers.includes(currentPath) && session) return NextResponse.redirect(new URL('/', req.nextUrl));
	if (protectedGuests.includes(currentPath) && !session)
		return NextResponse.redirect(new URL('/authenticate', req.nextUrl));

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image).*)'],
};
