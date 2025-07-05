// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as NextAuthJWT from "next-auth/jwt";
console.log("NextAuthJWT exports:", NextAuthJWT);

// define protected routes
const protectedRoutes = ['/protected']

export async function middleware(request: NextRequest) {
    console.log('MIDDLEWARE HIT') // for testing purposes

    const { pathname } = request.nextUrl
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }) 
    /** 
     * getToken() searches for correct token 
     * getToken() checks for the NextAuth-JWT-Token which is the former Laravel Bearer Token
     * ist has been "transformed" by next-auth to a JWT token
     * secret: process.env.NEXTAUTH_SECRET encodes the token 
    */ 

    if (!token) {
        console.warn("No session token found in middleware.")
    } else {
        console.log("Token payload in middleware:", token)
    }

    console.log('TOKEN FOUND BY next-auth:', token) // for testing purposes

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




