'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogout = async () => {
        setError(null)
        setLoading(true)

        const token = localStorage.getItem('token') // etrieve token from localStorage

        try {
            const res = await fetch('http://localhost:8000/api/logout', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`, // send token in authorization-header
                },
            })

            if (!res.ok) {
                const result = await res.json()
                throw new Error(result.message || 'Logout failed')
            }

            // Successfully logged out
            router.push('/public/login')
        } catch (err: any) {
            setError(err.message || 'Oops, something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-inactive text-foreground px-4 py-2 rounded-[var(--radius)] text-sm font-sans hover:opacity-90 transition"
            >
                {loading ? 'Logging out...' : 'Logout'}
            </button>

            {error && <p className="text-sm text-tertiary">{error}</p>}
        </div>
    )
}
