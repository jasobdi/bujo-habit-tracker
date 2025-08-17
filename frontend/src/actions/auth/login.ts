'use server';

import { setTokenCookie } from '@/lib/server/auth-cookies';

/**
 * Handles user login by sending credentials to the API and setting the authentication token cookie.
 */

export async function loginAction(data: {
    email: string
    password: string
}) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            cache: 'no-store',
        })

        if (!res.ok) {
            const err = await res.json()
            return { success: false, error: err.message || 'Login failed' }
        }

        const { token } = await res.json()
        setTokenCookie(token)

        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message || 'Unexpected error' }
    }
}
