'use client'

import { signOut } from 'next-auth/react'
import { BaseButton } from '../ui/button/base-button/base-button'
import { appToast } from '../feedback/app-toast'

export function LogoutButton() {
    const { successToast } = appToast()

    const handleLogout = async () => {
        successToast("Logged out successfully")
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
