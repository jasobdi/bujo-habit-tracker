import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// paths to be protected
const protectedRoutes = ['/protected']

export function middleware(request: NextRequest) {
    console.log("MIDDLEWARE HIT")

    const { pathname } = request.nextUrl // gets the current path from URL
    const token = request.cookies.get('token')?.value // gets token from cookies

    console.log('TOKEN IN COOKIE:', token)

    // check if curent path belongs to protected routes
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route),
    )

    // if the path is protected & no token is found, redirect to login
    if (isProtected && !token) {
        const loginUrl = new URL('/public/login', request.url)
        return NextResponse.redirect(loginUrl)
    }

    // else: if path is protected & token is found, load page
    return NextResponse.next()
}
// test: return NextResponse.redirect(new URL('/public/login', request.url))



// specification which paths should be protected
export const config = {
    matcher: ['/protected/:path*'], // all URLs within /protected/
}



