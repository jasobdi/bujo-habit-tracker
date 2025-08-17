import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// define protected routes
const protectedRoutes = ['/protected']

export async function middleware(request: NextRequest) {

    const { pathname } = request.nextUrl
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) 
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

    // route is protected but no token found -> redirect to login
    if (isProtected && !token) {
        const loginUrl = new URL('/public/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

// define which paths this middleware should run on
export const config = {
    matcher: ['/protected/:path*'],
}




