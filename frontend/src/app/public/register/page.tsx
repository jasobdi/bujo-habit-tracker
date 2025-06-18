'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/validation/registerSchema'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data: RegisterFormData) => {
        setError(null)
        setLoading(true)

        try {
            const res = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const result = await res.json()
                throw new Error(result.message || 'Registration failed')
            }

            router.push('/public/login') // oder: /protected/dashboard
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="max-w-sm mx-auto px-4 py-8">
            <h1 className="text-xl font-bold text-center mb-6 font-sans text-foreground">
                Register
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username */}
                <div className="flex flex-col">
                    <label className="text-sm font-sans mb-1 text-foreground">Name</label>
                    <input
                        type="text"
                        {...register('username')}
                        placeholder="Your name"
                        className="p-2 border border-border rounded-[var(--radius)] bg-input text-sm text-foreground"
                    />
                    {errors.username && (
                        <span className="text-sm text-tertiary mt-1">{errors.username.message}</span>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col">
                    <label className="text-sm font-sans mb-1 text-foreground">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="you@example.com"
                        className="p-2 border border-border rounded-[var(--radius)] bg-input text-sm text-foreground"
                    />
                    {errors.email && (
                        <span className="text-sm text-tertiary mt-1">{errors.email.message}</span>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col">
                    <label className="text-sm font-sans mb-1 text-foreground">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="••••••••"
                        className="p-2 border border-border rounded-[var(--radius)] bg-input text-sm text-foreground"
                    />
                    {errors.password && (
                        <span className="text-sm text-tertiary mt-1">{errors.password.message}</span>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-primary text-foreground py-2 rounded-[var(--radius)] font-sans text-sm hover:opacity-90 transition"
                >
                    Register
                </button>

                {/* Feedback */}
                {error && <p className="text-sm text-tertiary text-center mt-2">{error}</p>}
                {loading && <p className="text-sm text-secondary text-center mt-2">Registering...</p>}
            </form>
        </main>
    )
}
