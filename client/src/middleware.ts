import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers'
import { decrypt } from '@/helpers/authentication/session';

export default async function middleware(req: NextRequest) {
	const protectedRoutes = ['/settings'];
	const currentPath = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(currentPath);

	if (isProtectedRoute) {
		const token = (await cookies()).get('session')?.value;
		const session = token ? await decrypt(token) : null;
		if (!session?.user) return NextResponse.redirect(new URL('/authenticate', req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image).*)']
}