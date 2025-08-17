'use server';

import { getTokenFromCookie, deleteTokenCookie } from '@/lib/server/auth-cookies';

/**
 * Handles user logout by deleting the authentication token cookie.
 */

export async function logoutAction() {
    const token = getTokenFromCookie()

    if (!token) return { success: false, error: 'No token found' }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            cache: 'no-store',
        })

        deleteTokenCookie()
        return { success: res.ok }
    } catch {
        return { success: false, error: 'Logout failed' }
    }
}
