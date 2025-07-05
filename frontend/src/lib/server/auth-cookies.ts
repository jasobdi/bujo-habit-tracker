'use server'

// only use in Server Components or Server Actions!!

import { cookies } from "next/headers"

export function getTokenFromCookie(): string | null {
    const cookieStore = cookies()
    return cookieStore.get('token')?.value || null
}

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

export function deleteTokenCookie() {
    const cookieStore = cookies()
    cookieStore.delete('token')
}