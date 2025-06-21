'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { loginAction } from '@/actions/login/login-action'
import { BaseButton } from '@/components/ui/button/base-button/base-button'
import { cn } from '@/lib/utils'

const schema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof schema>

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(schema),
    })

    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (data: LoginFormData) => {
        const result = await loginAction(data)
        if (!result.success) {
            setError(result.error)
            return
        }

        router.push('/protected/dashboard')
    }

    return (

        <section className="max-w-sm mx-3 my-4 border-[2px] border-border rounded-[15px] p-6">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-sm text-center mb-2">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        className="p-2 border border-border rounded-radius bg-input text-sm text-center"
                    />
                    {errors.email && (
                        <p className="text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label className="text-sm text-center mb-1">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className="p-2 border border-border rounded-radius bg-input text-sm text-center"
                    />
                    {errors.password && (
                        <p className="text-sm text-tertiary mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <BaseButton
                    variant="text"
                    className={cn("h-[35px] px-[12px] py-[5px] text-lg rounded-radius-btn border-[2px] border-border font-montserrat mt-5")}>
                        Login
                </BaseButton>

                {/* Feedback */}
                {error && <p className="text-sm text-tertiary text-center mt-2">{error}</p>}
            </form>

            {/* Link to Register */}
            <p className="text-center text-xs text-inactive mt-4 font-sans">
                Don’t have an account yet?{' '}
                <a href="/public/register" className="underline color-inactive">
                    Register here
                </a>
            </p>
        </section>
    )
}
