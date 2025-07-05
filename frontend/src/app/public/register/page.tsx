'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import Link from "next/link"

const schema = z.object({
    username: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Za-zÄÖÜäöüß\s]+$/, 'No special characters allowed'),
    email: z.string().email('Email is invalid'),
    password: z
        .string()
        .min(8, 'Password must contain min. 8 characters')
        .max(16, 'Password can contain max. 16 characters')
        .regex(/[A-Z]/, 'Password must contain one capital letter')
        .regex(/[0-9]/, 'Password must contain one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain one special character'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (data: FormData) => {
        setError(null)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.message || 'Registration failed')
                return
            }

            reset()
            router.push('/public/login')
        } catch {
            setError('An unexpected error occurred')
        }
    }


    return (
        <div className="flex justify-center">
            <section className="max-w-sm mx-3 my-4 border-[2px] border-border rounded-[15px] p-6 font-sans">

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username */}
                    <div className="flex flex-col">
                        <label className="text-sm text-center mb-2">Username</label>
                        <input
                            type="text"
                            {...register('username')}
                            className="p-2 border-[2px] border-border rounded-radius bg-input text-sm text-center"
                        />
                        {errors.username && (
                            <p className="text-sm text-error mt-2">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="text-sm text-center mb-2">Email</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="p-2 border-[2px] border-border rounded-radius bg-input text-sm text-center"
                        />
                        {errors.email && (
                            <p className="text-sm text-error mt-2">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label className="text-sm text-center mb-2">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="p-2 border-[2px] border-border rounded-radius bg-input text-sm text-center"
                        />
                        {errors.password && (
                            <p className="text-sm text-error mt-2">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <BaseButton variant="text" className="mt-5 mb-5">
                            Register
                        </BaseButton>
                    </div>

                    {/* Feedback */}
                    {error && (
                        <p className="text-sm text-error text-center mt-2">{error}</p>
                    )}
                </form>

                {/* Link to Login */}
                <p className="text-center text-xs text-contrast mt-6 font-sans">
                    Already have an account?{' '}
                    <Link href="/public/login" className="underline text-contrast">
                        Login
                    </Link>
                </p>
            </section>
        </div>


    )
}
