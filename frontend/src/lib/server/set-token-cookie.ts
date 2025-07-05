// only use in Server Components or Server Actions!!
// set cookie
import { cookies } from 'next/headers'

export function setTokenCookie(token: string) {
    const cookieStore = cookies()
    cookieStore.set('token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
    })
}

