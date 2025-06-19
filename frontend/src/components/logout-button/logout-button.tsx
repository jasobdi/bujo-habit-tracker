'use client'

import { logoutAction } from '@/actions/logout/logout-action'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        const result = await logoutAction()
        if (result.success) {
            router.push('/public/login')
        } else {
            console.error(result.error)
        }
    }

    return <button onClick={handleLogout}>Logout</button>
}
