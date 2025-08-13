'use client'

import { useState, useEffect } from "react";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { ChevronsLeft, Save, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoryFormModal } from "@/components/modals/category-form-modal";
import { FrequencyFields } from "@/components/forms/create-habit/frequency-fields";
import { createHabit } from "@/lib/fetch/createHabit";
import { useSession } from 'next-auth/react';
import { habitSchema } from "@/lib/validation/habitSchema";
import { z } from "zod";
import { format } from "date-fns";
import { habitCommonFrequencies, HabitCommonFrequency, HabitCustomDays } from "@/types/habit";
import { ConfirmDialog } from "@/components/ui/dialog/confirm-dialog";
import { appToast } from "@/components/feedback/app-toast";
import { UnsavedChangesGuard } from "@/components/nav/unsaved-changes-guard";

const frequencies = [...habitCommonFrequencies, 'custom'] as const;
type Frequency = typeof frequencies[number];
type EndType = 'never' | 'on' | 'after';

const isCustomFrequency = (f: Frequency): f is 'custom' => f === 'custom';
const isAfterEnd = (t: EndType): t is 'after' => t === 'after';

export default function NewHabit() {
    const router = useRouter();
    const { data: session } = useSession();
    const { successToast, errorToast } = appToast();

    // states for custom frequency
    const [customType, setCustomType] = useState<HabitCommonFrequency>('daily');
    const [repeatInterval, setRepeatInterval] = useState<number>(1);

    // form states
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [customDays, setCustomDays] = useState<HabitCustomDays[]>([]);
    const [endType, setEndType] = useState<EndType>('never');
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [repeatCount, setRepeatCount] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // field error states (Zod validation)
    const [titleError, setTitleError] = useState<string | undefined>(undefined);
    const [startDateError, setStartDateError] = useState<string | undefined>(undefined);
    const [frequencyError, setFrequencyError] = useState<string | undefined>(undefined);
    const [customDaysError, setCustomDaysError] = useState<string | undefined>(undefined);
    const [endDateError, setEndDateError] = useState<string | undefined>(undefined);
    const [repeatCountError, setRepeatCountError] = useState<string | undefined>(undefined);
    const [categoriesError, setCategoriesError] = useState<string | undefined>(undefined);
    const [repeatIntervalError, setRepeatIntervalError] = useState<string | undefined>(undefined);

    // categories
    type Category = { id: number; title: string; }
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [categoriesUpdated, setCategoriesUpdated] = useState(0);

    // unsaved changes guard (isDirty = unsaved changes)
    const isDirty =
        title.trim().length > 0 ||
        startDate != null ||
        frequency !== 'daily' ||
        customType !== 'daily' ||
        (isCustomFrequency(frequency) && repeatInterval !== 1) ||
        customDays.length > 0 ||
        endType !== 'never' ||
        endDate != null ||
        (isAfterEnd(endType) && repeatCount !== 1) ||
        selectedCategories.length > 0;

    /* Form handling */
    // handle frequency change
    function toggleCustomDay(day: HabitCustomDays) {
        setCustomDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }

    // Zod-errors for input fields
    function getErrorFor(err: z.ZodError, field: string): string | undefined {
        const issue = err.issues.find(i => i.path[0] === field || i.path.join('.') === field);
        return issue?.message;
    }

    // Cancel / Back per ConfirmDialog
    const handleDiscard = () => {
        router.push('/protected/habits');
    };

    // Kategorien laden
    async function fetchCategories() {
        if (!session?.accessToken) return;
        try {
            const res = await fetch('http://localhost:8000/api/categories', {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    Accept: 'application/json',
                },
            });
            if (!res.ok) {
                const text = await res.text();
                console.error('Failed to fetch categories:', res.status, text);
                return;
            }
            const data = await res.json();
            setAvailableCategories(data);
        } catch (err) {
            console.error("Error loading categories", err);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [session?.accessToken, categoriesUpdated]);

    // reset error states when the form fields change
    useEffect(() => {
        if (frequency !== "custom") {
            setCustomDays([]);
            setCustomDaysError(undefined);
            setRepeatIntervalError(undefined);
        }
    }, [frequency]);

    useEffect(() => {
        if (customType !== "weekly") {
            setCustomDays([]);
            setCustomDaysError(undefined);
        }
    }, [customType]);
    useEffect(() => {
        if (endType !== "on") setEndDateError(undefined);
        if (endType !== "after") setRepeatCountError(undefined);
    }, [endType]);

    // create a new category through modal & update category-tag list
    const handleCategorySubmit = async (categoryData: { id?: number, title: string }): Promise<Category> => {
        if (!session?.accessToken) {
            console.error("Not authenticated.");
            throw new Error("Not authenticated.");
        }
        try {
            const res = await fetch("http://localhost:8000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.accessToken}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ title: categoryData.title })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            const result = await res.json();
            const newCategory: Category = result.category;

            setAvailableCategories(prev => [...prev, newCategory]);
            setSelectedCategories(prev => [...prev, newCategory.id]);
            setCategoriesUpdated(prev => prev + 1);

            return newCategory;
        } catch (error) {
            console.error("Failed to create category:", error);
            throw error;
        }
    };

    /** SAVE */
    async function handleSave(e: React.MouseEvent) {

        e.preventDefault();
        if (!session?.accessToken) {
            errorToast("Not authenticated", "Please log in and try again.", 3500, "habit-create-unauth");
            return;
        }
        // 1) reset errors
        setTitleError(undefined);
        setStartDateError(undefined);
        setFrequencyError(undefined);
        setCustomDaysError(undefined);
        setEndDateError(undefined);
        setRepeatCountError(undefined);
        setCategoriesError(undefined);
        setRepeatIntervalError(undefined);

        // 2) raw data for Zod validation
        const rawData = {
            title,
            frequency,
            startDate,
            customDays: frequency === "custom" ? customDays : [],
            endType,
            endDate: endType === "on" ? endDate : undefined,
            repeatCount: endType === "after" ? repeatCount : undefined,
            categories: selectedCategories,
            repeatInterval: frequency === "custom" ? repeatInterval : undefined,
            customType,
        };

        // 3) pre-validation checks without a return, only flags
        let hasPreError = false;

        if (endType === "on" && !endDate) {
            setEndDateError("End date is required");
            hasPreError = true;
        }
        if (endType === "after" && (!repeatCount || repeatCount < 1)) {
            setRepeatCountError("Repeat count must be at least 1");
            hasPreError = true;
        }
        if (frequency === "custom" && customType === "weekly" && customDays.length === 0) {
            setCustomDaysError("Select at least one weekday");
            hasPreError = true; // <— statt return
        }

        // 4) Zod validation
        const result = habitSchema.safeParse(rawData);

        // Helper to get specific error messages for fields
        if (!result.success || hasPreError) {
            if (!result.success) {
                const err = result.error;
                setTitleError(getErrorFor(err, 'title'));
                setStartDateError(getErrorFor(err, 'startDate'));
                setFrequencyError(getErrorFor(err, 'frequency'));
                setCustomDaysError(prev => prev ?? getErrorFor(err, 'customDays'));
                setEndDateError(prev => prev ?? getErrorFor(err, 'endDate'));
                setRepeatCountError(prev => prev ?? getErrorFor(err, 'repeatCount'));
                setCategoriesError(getErrorFor(err, 'categories'));
                setRepeatIntervalError(prev => prev ?? getErrorFor(err, 'repeatInterval'));
            }
            errorToast("Form is incomplete", undefined, 4000, "habit-create-validation");
            return; // stop submit if any error
        }

        // 5) Successful validation
        const validated = result.data;
        const apiData: Record<string, any> = {
            title: validated.title,
            frequency: validated.frequency === 'custom' ? `custom_${customType}` : validated.frequency,
            start_date: format(validated.startDate!, 'yyyy-MM-dd'),
            custom_days: validated.customDays,
            category_ids: validated.categories,
            repeat_interval: validated.frequency === 'custom' ? repeatInterval : 1,
            repeat_count: validated.repeatCount,
        };
        if (validated.endType === "on" && validated.endDate) {
            apiData.end_date = format(validated.endDate, 'yyyy-MM-dd');
        }

        // 6) Submit the data to API
        setIsSubmitting(true);
        try {
            await createHabit(apiData, session.accessToken);
            successToast("Habit created", undefined, 2500, "habit-create-success");
            router.push('/protected/habits');
        } catch (err) {
            console.error("Failed to create habit:", err);
            errorToast("Failed to save habit", "Please try again.", 4000, "habit-create-error");
        } finally {
            setIsSubmitting(false);
        }
    }

    // toggle for category selection
    function toggleCategory(id: number) {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(catId => catId !== id)
                : [...prev, id]
        );
    }

    return (
        <div className="flex justify-center w-full">
            <form className="flex flex-col p-4 max-w-xs md:max-w-md mx-auto border-black border-[2px] rounded-radius">

                {/* Title */}
                <label htmlFor="title" className="font-semibold"> Title
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full border-[2px] border-black rounded-radius mt-2 mb-1 p-2 font-normal ${titleError ? 'border-[2px] border-[var(--error)]' : ''}`}
                        aria-invalid={!!titleError}
                        aria-describedby={titleError ? "title-error" : undefined}
                    />
                    {titleError ? <p id="title-error" className="text-sm text-[var(--error)] font-normal mb-3">{titleError}</p> : <div className="mb-3" />}
                </label>

                {/* Frequency */}
                <div>
                    <label htmlFor="frequency" className="font-semibold mb-2">Frequency</label>
                    <div className="flex flex-col w-auto mb-3" id="frequency">
                        {frequencies.map((f) => (
                            <BaseButton
                                key={f}
                                variant="text"
                                type="button"
                                aria-label={`Set frequency to ${f}`}
                                className={`px-4 py-2 m-2 border-[2px] border-black rounded-radius
                                    ${frequency === f ? 'bg-primary' : 'bg-contrast text-black'}`}
                                onClick={() => {
                                    setFrequency(f);
                                    if (f === "custom") setCustomType("weekly");
                                }}
                            >
                                {f}
                            </BaseButton>
                        ))}
                    </div>
                    {frequencyError ? <p className="text-sm text-[var(--error)] mb-2">{frequencyError}</p> : null}
                </div>

                {/* FrequencyFields */}
                <FrequencyFields
                    frequency={frequency}
                    customType={customType}
                    setCustomType={setCustomType}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    startDateError={startDateError}
                    repeatInterval={repeatInterval}
                    setRepeatInterval={setRepeatInterval}
                    customDays={customDays}
                    toggleCustomDay={toggleCustomDay}
                    endType={endType}
                    setEndType={setEndType}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    repeatCount={repeatCount}
                    setRepeatCount={setRepeatCount}
                    isEditing={false}
                    customDaysError={customDaysError}
                    endDateError={endDateError}
                    repeatCountError={repeatCountError}
                    repeatIntervalError={repeatIntervalError}
                />

                {/* Categories */}
                <div className="mt-4">
                    <label className="font-semibold md:text-md">Categories</label>
                    <br />
                    <p>Habits must contain at least one category.</p>

                    <CategoryFormModal initialData={null} onSubmit={handleCategorySubmit}>
                        <BaseButton
                            type="button"
                            variant="text"
                            className="bg-secondary"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            add category
                        </BaseButton>
                    </CategoryFormModal>

                    {categoriesError ? <p className="text-sm text-[var(--error)] font-normal">{categoriesError}</p> : null}

                    <div className="flex flex-wrap gap-2 my-2">
                        {availableCategories.map((cat) => cat.id && cat.title ? (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => toggleCategory(cat.id)}
                                className={`md:text-md border-[2px] border-black rounded-radius-btn px-2 py-1 
                                ${selectedCategories.includes(cat.id) ? 'bg-tags' : 'bg-white'}`}
                                aria-pressed={selectedCategories.includes(cat.id)}
                            >
                                {cat.title}
                            </button>
                        ) : null
                        )}
                    </div>

                </div>

                {/* Cancel / Back + Save */}
                <div className="flex justify-around mt-6">
                    {/* Cancel Button - triggers ConfirmDialog */}
                    <ConfirmDialog
                        title="Discard new habit?"
                        description="This will discard all unsaved changes."
                        destructive
                        confirmText="Discard"
                        cancelText="Cancel"
                        busyText="Discarding..."
                        onConfirm={handleDiscard}
                        trigger={
                            <BaseButton variant="icon" type="button" className="bg-primary">
                                <ChevronsLeft className="h-10 w-10" strokeWidth={1.5} />
                            </BaseButton>
                        }
                    />
                    {/* Save Button */}
                    <BaseButton
                        type="submit"
                        variant="icon"
                        className="bg-primary"
                        onClick={handleSave}
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        <Save className="h-10 w-10" strokeWidth={1.5} />
                    </BaseButton>
                </div>
            </form>
            {/* Unsaved Changes Guard */}
            <UnsavedChangesGuard
                when={isDirty && !isSubmitting}
                title="Discard new habit?"
                description="You have unsaved changes. If you leave this page, your changes will be lost."
            />
        </div>
    );
}