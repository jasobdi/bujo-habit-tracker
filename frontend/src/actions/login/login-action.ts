'use server'

import { cookies } from "next/headers"

export async function loginAction(data: {
    email: string
    password: string
}) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
            cache: 'no-store', // important for SSR/server actions
        })

        if (!response.ok) {
            const errorData = await response.json()
            return {
                success: false,
                error: errorData.message || 'Login failed',
            }
        }

        const result = await response.json()
        const token = result.token

        // save token to HttpOnly cookie
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 1 day
        })

        return { success: true}
    } catch {
        return { success: false, error: 'An unexpected error occurred' }
    }
}
