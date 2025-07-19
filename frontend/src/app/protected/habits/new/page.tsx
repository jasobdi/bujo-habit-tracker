'use client'

import { useState, useEffect } from "react";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { ChevronsLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateCategoryModal } from "@/components/modals/create-category-modal";
import { FrequencyFields } from "@/components/forms/create-habit/frequency-fields";
import { createHabit } from "@/lib/fetch/createHabit";
import { useSession } from 'next-auth/react';
import { habitSchema } from "@/lib/validation/habitSchema";
import { z } from "zod";

export default function NewHabit() {
    const router = useRouter();
    const { data: session } = useSession();


    // define frequency options
    const frequencies = ['daily', 'weekly', 'monthly', 'custom'] as const;
    type Frequency = typeof frequencies[number];

    // states for custom frequency
    const [customType, setCustomType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [repeatInterval, setRepeatInterval] = useState<number>(1);

    // states for the form
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [customDays, setCustomDays] = useState<string[]>([]);
    const [endType, setEndType] = useState<'never' | 'on' | 'after'>('never');
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [repeatCount, setRepeatCount] = useState<number>(1);

    /* Form handling */
    // handle frequency change
    function toggleCustomDay(day: string) {
        setCustomDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }

    // cancel-button handler
    function handleCancel(e: React.MouseEvent) {
        e.preventDefault();
        const confirmed = window.confirm("Are you sure you want to discard this habit?");
        if (confirmed) {
            router.push('/protected/habits');
        }
    }

    // save-button handler
    async function handleSave(e: React.MouseEvent) {
        e.preventDefault();

        // Basic Validation
        if (!title.trim()) {
            alert("Please enter a title.");
            return;
        }

        if (!frequency) {
            alert("Please select a frequency.");
            return;
        }

        if (!startDate) {
            alert("Please select a start date.");
            return;
        }

        if (frequency === 'custom' && customDays.length === 0) {
            alert("Please select at least one custom day.");
            return;
        }

        if (endType === 'on' && !endDate) {
            alert("Please select an end date.");
            return;
        }

        if (endType === 'after' && repeatCount <= 0) {
            alert("Repeat count must be greater than 0.");
            return;
        }

        // valudation with Zod schema
        try {
            const validated = habitSchema.parse({
                title,
                frequency,
                startDate,
                customDays: frequency === "custom" ? customDays : [],
                endType,
                endDate: endType === "on" ? endDate : undefined,
                repeatCount: endType === "after" ? repeatCount : undefined,
                categories: selectedCategories,
            });

            // check for session and accessToken
            if (!session?.accessToken) {
                alert("Not authenticated.");
                return;
            }
            await createHabit(validated, session.accessToken);


        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Validation errors:", error.flatten());
            }
        }
    }

    /* Category handling */
    type Category = {
        id: number;
        title: string;
    }

    // state for Categories
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    // load categories from API
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                setAvailableCategories(data);
            } catch (err) {
                console.error("Error loading categories", err);
            }
        }
        fetchCategories();
    }, []);

    // toogle for category selection
    function toggleCategory(id: number) {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(catId => catId !== id)
                : [...prev, id]
        );
    }

    return (
        <div className="flex justify-center w-full">
            <form className="flex flex-col gap-4 p-4 max-w-md md:w-auto mx-auto border-black border-[2px] rounded-radius">
                <label htmlFor="title">
                    Title
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border-[2px] border-black rounded-radius mt-4 p-2"
                    />
                </label>

                <div>
                    <label htmlFor="frequency">Frequency</label>
                    <div className="flex gap-2" id="frequency">
                        {frequencies.map((f) => (
                            <BaseButton
                                key={f}
                                variant="text"
                                type="button"
                                aria-label={`Set frequency to ${f}`}
                                className={`px-4 py-2 border-[2px] border-black rounded-radius
                                    ${frequency === f ? 'bg-primary' : 'bg-contrast text-black'}`}
                                onClick={() => setFrequency(f)}
                            >
                                {f}
                            </BaseButton>
                        ))}
                    </div>
                </div>

                {FrequencyFields({
                    frequency,
                    customType,
                    setCustomType,
                    startDate,
                    setStartDate,
                    repeatInterval,
                    setRepeatInterval,
                    customDays,
                    toggleCustomDay,
                    endType,
                    setEndType,
                    endDate,
                    setEndDate,
                    repeatCount,
                    setRepeatCount
                })}

                <div>
                    <label>Categories</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {availableCategories.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => toggleCategory(cat.id)}
                                className=
                                {`border border-black rounded px-2 py-1 
                                ${selectedCategories.includes(cat.id)
                                        ? 'bg-secondary text-white'
                                        : 'bg-white'
                                    }`}
                            >
                                {cat.title}
                            </button>
                        ))}
                        <CreateCategoryModal onCreate={(newCat) => setAvailableCategories(prev => [...prev, newCat])} />
                    </div>
                </div>

                <div className="flex justify-around mt-6">
                    <BaseButton
                        variant="icon"
                        type="button"
                        className="bg-primary"
                        onClick={handleCancel}
                    >
                        <ChevronsLeft className="h-10 w-10" />
                    </BaseButton>
                    <BaseButton
                        type="submit"
                        variant="icon"
                        className="bg-primary"
                        onClick={handleSave}
                    >
                        <Save className="h-10 w-10" />
                    </BaseButton>
                </div>
            </form>
        </div>
    );
}