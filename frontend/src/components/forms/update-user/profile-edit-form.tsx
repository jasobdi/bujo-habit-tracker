'use client'

import { useForm } from "react-hook-form"
import { Save } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import { useSession } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"

const schema = z.object({
    username: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Za-zÄÖÜäöüß\s]+$/, 'No special characters allowed'),
    email: z.string().email('Email is invalid'),
    // password is optional, but if provided, must meet the criteria
    // for security reasons, the password will not be shown in the form
    password: z
        .string()
        .min(8, 'Password must contain min. 8 characters')
        .max(16, 'Password can contain max. 16 characters')
        .regex(/[A-Z]/, 'Password must contain one capital letter')
        .regex(/[0-9]/, 'Password must contain one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain one special character')
        .optional()
        .or(z.literal('')),
})

type FormData = z.infer<typeof schema>

type ProfileEditFormProps = {
    initialData: { username: string | null | undefined; email: string | null | undefined };
    onUpdateSuccess: () => void;
    onInvalid?: () => void;
};

export function ProfileEditForm({ initialData, onUpdateSuccess, onInvalid }: ProfileEditFormProps) {
    const { data: session } = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            username: initialData.username || '',
            email: initialData.email || '',
        },
    })

    const [error, setError] = useState<string | null>(null)

    const onFormInvalid = () => {
        // Tell parent to show the toast
        onInvalid?.();
    };

    const onSubmit = async (data: FormData) => {
        setError(null)

        try {
            const res = await fetch(`http://localhost:8000/api/user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.message || 'Update failed')
                return
            }

            // callback to notify parent component of success
            onUpdateSuccess();
        } catch {
            setError('An unexpected error occurred')
        }
    }

    return (
        <div className="flex justify-center">
            <section className="max-w-sm md:w-[340px] mx-2 my-2 p-4 font-sans">
                <form noValidate onSubmit={handleSubmit(onSubmit, onFormInvalid)} className="space-y-8">
                    {/* Username */}
                    <div className="flex flex-col">
                        <label className="text-sm text-center font-bold mb-3">Username</label>
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
                        <label className="text-sm text-center font-bold mb-3">Email</label>
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
                        <label className="text-sm text-center font-bold mb-3">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className="h-10 w-full rounded-radius border-[2px] border-border bg-input px-3 pr-10 text-sm text-center"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "hide password" : "show password"}
                                className="absolute inset-y-0 right-0 flex items-center px-3"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-600" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="mt-2 text-sm text-error">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <BaseButton type="submit" variant="icon" className="mt-2 mb-5 bg-primary focus-visible:rounded-full" aria-label="Save changes">
                            <Save className="h-10 w-10" strokeWidth={1.5} />
                        </BaseButton>
                    </div>

                    {/* Feedback */}
                    {error && (
                        <p className="text-sm text-error text-center mt-2">{error}</p>
                    )}
                </form>
            </section>
        </div>
    )
}