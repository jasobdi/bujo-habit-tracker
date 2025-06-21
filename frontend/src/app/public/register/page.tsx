'use client'

import { registerAction } from "@/actions/register/register-action"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import { cn } from "@/lib/utils"

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
        const result = await registerAction(data)
        if (!result.success) {
            setError(result.error)
            return
        }
        reset()
        router.push("/public/login")
    }

    return (
        <section className="max-w-sm mx-3 my-4 border-[2px] border-border rounded-[15px] p-6 font-sans">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Username */}
                <div className="flex flex-col">
                    <label className="text-sm text-center mb-2">Username</label>
                    <input
                        type="text"
                        {...register('username')}
                        className="p-2 border-[2px] border-border rounded-radius bg-input text-sm text-center"
                    />
                    {errors.username && (
                        <p className="text-sm text-tertiary mt-1 text-center">{errors.username.message}</p>
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
                        <p className="text-sm text-tertiary mt-1 text-center">{errors.email.message}</p>
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
                        <p className="text-sm text-tertiary mt-1 text-center">{errors.password.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <BaseButton
                    variant="text"
                    className={cn("h-9 px-3 py-1 text-lg rounded-radius-btn border-[2px] border-border font-sans mt-5 mb-5")}
                >
                    Register
                </BaseButton>

                {/* Feedback */}
                {error && (
                    <p className="text-sm text-error text-center mt-2">{error}</p>
                )}
            </form>

            {/* Link to Login */}
            <p className="text-center text-xs text-inactive mt-4 font-sans">
                Already have an account?{' '}
                <a href="/public/login" className="underline color-inactive">
                    Login here
                </a>
            </p>

        </section>

    )
}
