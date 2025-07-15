'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseButton } from '@/components/ui/button/base-button/base-button'
import Link from 'next/link'

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
        const res = await signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password,
            callbackUrl: '/protected/dashboard',
        })

        // console.log("SignIn result: ", res)

        if (!res || !res.ok)  {
            setError('Invalid email or password')
            return
        }

        if (res.url) {
            router.push(res.url)
        }
    }

    return (
        <div className="flex justify-center">
            <section className="max-w-sm mx-3 my-4 border-[2px] border-border rounded-radius p-6 font-sans">

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                        <BaseButton type="submit" variant="text" className="mt-5 mb-5">
                            Login
                        </BaseButton>
                    </div>

                    {/* Feedback */}
                    {error && <p className="text-sm text-error text-center mt-2">{error}</p>}
                </form>

                {/* Link to Register */}
                <p className="text-center text-xs text-contrast mt-8 font-sans">
                    Don’t have an account yet?{' '}
                    <Link href="/public/register" className="underline text-contrast">
                        Register here
                    </Link>
                </p>
            </section>
        </div>
    )
}

