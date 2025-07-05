'use client'

import { signOut } from 'next-auth/react'
import { BaseButton } from '@/components/ui/button/base-button/base-button'

export function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ callbackUrl: '/public/login' })
    }

    return (
        <div className="flex justify-center">
            <BaseButton 
                variant="text" 
                className="bg-tertiary" 
                onClick={handleLogout}
            >
                Logout
            </BaseButton>
        </div>
    )
}
