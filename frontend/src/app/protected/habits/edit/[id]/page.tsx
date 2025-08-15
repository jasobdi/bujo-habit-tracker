'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ChevronsLeft, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns'; // parseISO for Date-Strings
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { HabitEndType, habitSchema } from '@/lib/validation/habitSchema';
import { updateHabit } from '@/lib/fetch/updateHabit';
import { habitCommonFrequencies, HabitCommonFrequency } from '@/types/habit';
import { CategoryFormModal } from '@/components/modals/category-form-modal';
import { FrequencyFields } from '@/components/forms/create-habit/frequency-fields';
import { appToast } from '@/components/feedback/app-toast';
import { ConfirmDialog } from '@/components/ui/dialog/confirm-dialog';
import { UnsavedChangesGuard } from '@/components/nav/unsaved-changes-guard';
import { useMemo } from "react";

export default function EditHabit() {
    const router = useRouter();
    const { data: session } = useSession();
    const params = useParams();
    const habitId = params.id as string; // get habit ID from URL

    // define frequency options
    const frequencies = [...habitCommonFrequencies, 'custom'] as const;
    type Frequency = typeof frequencies[number];

    // states for custom frequency
    const [customType, setCustomType] = useState<HabitCommonFrequency>('daily');
    const [repeatInterval, setRepeatInterval] = useState<number>(1);

    // states for the form
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [customDays, setCustomDays] = useState<string[]>([]);
    const [endType, setEndType] = useState<HabitEndType>('never');
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [repeatCount, setRepeatCount] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    // original snapshot to detect unsaved changes
    const [originalSnapshot, setOriginalSnapshot] = useState<string | null>(null);


    // Zod error states (no startDateError UI here because it's fixed)
    const [titleError, setTitleError] = useState<string | undefined>();
    const [frequencyError, setFrequencyError] = useState<string | undefined>();
    const [customDaysError, setCustomDaysError] = useState<string | undefined>();
    const [endDateError, setEndDateError] = useState<string | undefined>();
    const [repeatCountError, setRepeatCountError] = useState<string | undefined>();
    const [categoriesError, setCategoriesError] = useState<string | undefined>();
    const [repeatIntervalError, setRepeatIntervalError] = useState<string | undefined>();

    // categories
    type Category = { id: number; title: string; }
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    // toasts
    const { successToast, errorToast } = appToast();

    // --- Snapshot helpers --- // 

    // Change a form state into a JSON string
    const snapshotOf = (s: {
        title: string;
        frequency: string;
        customType: string;
        repeatInterval: number;
        customDays: string[];
        endType: HabitEndType;
        endDate?: Date | undefined;
        repeatCount: number;
        selectedCategories: number[];
    }) =>
        JSON.stringify({
            title: s.title.trim(),
            frequency: s.frequency,
            customType: s.customType,
            repeatInterval: s.repeatInterval,
            customDays: [...s.customDays].sort(),
            endType: s.endType,
            endDate: s.endDate ? format(s.endDate, 'yyyy-MM-dd') : null,
            repeatCount: s.repeatCount,
            selectedCategories: [...s.selectedCategories].sort(),
        });

    // Compute current snapshot from live state
    const currentSnapshot = useMemo(
        () =>
            snapshotOf({
                title,
                frequency,
                customType,
                repeatInterval,
                customDays,
                endType,
                endDate,
                repeatCount,
                selectedCategories,
            }),
        [
            title,
            frequency,
            customType,
            repeatInterval,
            customDays,
            endType,
            endDate,
            repeatCount,
            selectedCategories,
        ]
    );

    // isDirty: if an original snapshot is available and it is differs from the current
    const isDirty = originalSnapshot !== null && originalSnapshot !== currentSnapshot;

    // --- Validation helper --- //

    function getErrorFor(err: any, field: string): string | undefined {
        if (!err?.issues) return undefined;
        const issue = err.issues.find((i: any) => i.path[0] === field);
        return issue?.message;
    }

    // --- Load habit + categories --- //

    useEffect(() => {
        if (!session?.accessToken || !habitId) return;

        let cancelled = false;

        (async () => {
            setIsFetching(true);                // ← Laden starten
            try {
                // Kategorien und Habit parallel laden
                const [catsRes, habitRes] = await Promise.all([
                    fetch('http://localhost:8000/api/categories', {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                            Accept: 'application/json',
                        },
                    }),
                    fetch(`http://localhost:8000/api/habits/${habitId}`, {
                        headers: {
                            Authorization: `Bearer ${session.accessToken}`,
                            Accept: 'application/json',
                        },
                    }),
                ]);

                if (!catsRes.ok || !habitRes.ok) {
                    console.error('Failed to fetch categories or habit');
                    return;
                }

                const [cats, h] = await Promise.all([catsRes.json(), habitRes.json()]);
                if (cancelled) return;

                // Kategorien setzen
                setAvailableCategories(cats);

                // Habit-Daten mappen
                setTitle(h.title);

                if (typeof h.frequency === 'string' && h.frequency.startsWith('custom_')) {
                    setFrequency('custom');
                    const ct = h.frequency.replace('custom_', '') as HabitCommonFrequency;
                    setCustomType(ct ?? 'daily');
                } else {
                    setFrequency(h.frequency as typeof frequencies[number]);
                    setCustomType('daily');
                }

                setRepeatInterval(h.repeat_interval ?? 1);
                setStartDate(parseISO(h.start_date));

                if (h.frequency?.startsWith('custom_') && Array.isArray(h.custom_days)) {
                    setCustomDays(h.custom_days);
                } else {
                    setCustomDays([]);
                }

                if (h.end_date) {
                    setEndType('on');
                    setEndDate(parseISO(h.end_date));
                    setRepeatCount(1);
                } else if (h.repeat_count) {
                    setEndType('after');
                    setRepeatCount(h.repeat_count);
                    setEndDate(undefined);
                } else {
                    setEndType('never');
                    setEndDate(undefined);
                    setRepeatCount(1);
                }

                setSelectedCategories(h.categories?.map((c: { id: number }) => c.id) ?? []);
                // Build a normalized snapshot DIRECTLY from the fetched API data
                const normFrequency: Frequency =
                    typeof h.frequency === 'string' && h.frequency.startsWith('custom_')
                        ? 'custom'
                        : (h.frequency as Frequency);

                const normCustomType: HabitCommonFrequency =
                    typeof h.frequency === 'string' && h.frequency.startsWith('custom_')
                        ? (h.frequency.replace('custom_', '') as HabitCommonFrequency)
                        : 'daily';

                const normRepeatInterval = h.repeat_interval ?? 1;
                const normCustomDays: string[] =
                    h.frequency?.startsWith('custom_') && Array.isArray(h.custom_days) ? h.custom_days : [];

                let normEndType: HabitEndType = 'never';
                let normEndDate: Date | undefined = undefined;
                let normRepeatCount = 1;
                if (h.end_date) {
                    normEndType = 'on';
                    normEndDate = parseISO(h.end_date);
                } else if (h.repeat_count) {
                    normEndType = 'after';
                    normRepeatCount = h.repeat_count;
                }

                const normSelectedCategories: number[] = (h.categories ?? []).map((c: { id: number }) => c.id);

                setOriginalSnapshot(
                    snapshotOf({
                        title: h.title ?? '',
                        frequency: normFrequency,
                        customType: normCustomType,
                        repeatInterval: normRepeatInterval,
                        customDays: normCustomDays,
                        endType: normEndType,
                        endDate: normEndDate,
                        repeatCount: normRepeatCount,
                        selectedCategories: normSelectedCategories,
                    })
                );
            } catch (e) {
                console.error('Error fetching habit data', e);
            } finally {
                if (!cancelled) setIsFetching(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [session?.accessToken, habitId]);

    // --- Handlers --- //

    function toggleCustomDay(day: string) {
        setCustomDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
    }

    const handleDiscard = () => {
        router.push('/protected/habits');
    };

    // reset error states when the form fields change
    useEffect(() => {
        if (frequency !== "custom") {
            setCustomDaysError(undefined);
            setRepeatIntervalError(undefined);
        }
    }, [frequency]);

    useEffect(() => {
        if (customType !== "weekly") {
            setCustomDaysError(undefined);
        }
    }, [customType]);

    useEffect(() => {
        if (endType !== "on") setEndDateError(undefined);
        if (endType !== "after") setRepeatCountError(undefined);
    }, [endType]);

    // save
    async function handleSave(e: React.MouseEvent) {
        e.preventDefault();
        if (!session?.accessToken || !habitId) {
            errorToast('Not authenticated', 'Please log in and try again.', 3500, 'habit-edit-unauth');
            return;
        }

        // reset field errors
        setTitleError(undefined);
        setFrequencyError(undefined);
        setCustomDaysError(undefined);
        setEndDateError(undefined);
        setRepeatCountError(undefined);
        setCategoriesError(undefined);
        setRepeatIntervalError(undefined);

        // raw form data for Zod validation
        const rawData = {
            title,
            frequency,
            startDate, // fixed but still validated
            customDays: frequency === 'custom' ? customDays : [],
            endType,
            endDate: endType === 'on' ? endDate : undefined,
            repeatCount: endType === 'after' ? repeatCount : undefined,
            categories: selectedCategories,
            repeatInterval: frequency === 'custom' ? repeatInterval : undefined,
            customType,
        };

        // quick pre-checks without returns
        let hasPreError = false;

        if (endType === 'on' && !endDate) {
            setEndDateError('End date is required');
            hasPreError = true;
        }
        if (endType === 'after' && (!repeatCount || repeatCount < 1)) {
            setRepeatCountError('Repeat count must be at least 1');
            hasPreError = true;
        }
        if (frequency === 'custom' && customType === 'weekly' && customDays.length === 0) {
            setCustomDaysError('Select at least one weekday');
            hasPreError = true;
        }

        const result = habitSchema.safeParse(rawData);

        if (!result.success || hasPreError) {
            const err = !result.success ? result.error : undefined;

            if (err) {
                setTitleError(getErrorFor(err, 'title'));
                setFrequencyError(getErrorFor(err, 'frequency'));
                setCustomDaysError(prev => prev ?? getErrorFor(err, 'customDays'));
                setEndDateError(prev => prev ?? getErrorFor(err, 'endDate'));
                setRepeatCountError(prev => prev ?? getErrorFor(err, 'repeatCount'));
                setCategoriesError(getErrorFor(err, 'categories'));
                setRepeatIntervalError(getErrorFor(err, 'repeatInterval'));
            }

            errorToast('Form is incomplete', undefined, 3000, 'habit-edit-incomplete');
            return;
        }

        // API payload
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
        if (validated.endType === 'on' && validated.endDate) {
            apiData.end_date = format(validated.endDate, 'yyyy-MM-dd');
        } else {
            apiData.end_date = null;
        }

        setIsSubmitting(true);
        try {
            const numericHabitId = parseInt(habitId, 10);
            await updateHabit(numericHabitId, apiData, session.accessToken);
            successToast('Habit updated', undefined, 2500, 'habit-edit-success');
            router.push('/protected/habits');
        } catch (err) {
            console.error('Failed to update habit:', err);
            errorToast('Failed to save habit', 'Please try again.', 4000, 'habit-edit-error');
        } finally {
            setIsSubmitting(false);
        }
    }

    // selection toggle for categories
    function toggleCategory(id: number) {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
        );
    }

    if (!habitId) return <div>Loading error: Habit ID is missing.</div>;
    if (isFetching) return <div>Loading data...</div>;


    return (
        <div>
            {/* Guard */}
            <UnsavedChangesGuard
                when={isDirty}
                title="Discard changes?"
                description="You have unsaved changes. Are you sure you want to leave?"
            />

            <div className="flex justify-center w-full">
                <form className="flex flex-col p-4 max-w-xs md:max-w-md mx-auto border-black border-[2px] rounded-radius">
                    {/* Title */}
                    <label htmlFor="title" className="font-semibold">
                        {' '}
                        Title
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full border-[2px] border-black rounded-radius mt-2 mb-1 p-2 font-normal 
                            ${titleError ? 'border-[2px] border-[var(--error)]' : ''
                                }`}
                            aria-invalid={!!titleError}
                            aria-describedby={titleError ? 'title-error' : undefined}
                        />
                        {titleError ? (<p id="title-error" className="text-sm text-[var(--error)] font-normal mb-3">{titleError}</p>) : (<div className="mb-3" />)}
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
                                        if (f === 'custom' && (customType !== 'daily' && customType !== 'weekly' && customType !== 'monthly')) {
                                            setCustomType('weekly');
                                        }
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
                        repeatInterval={repeatInterval}
                        setRepeatInterval={setRepeatInterval}
                        customDays={customDays}
                        toggleCustomDay={toggleCustomDay as any}
                        endType={endType}
                        setEndType={setEndType}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        repeatCount={repeatCount}
                        setRepeatCount={setRepeatCount}
                        isEditing={true}
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

                        <CategoryFormModal
                            token={session!.accessToken}
                            onCreated={(newCat) => {
                                setAvailableCategories(prev => [...prev, newCat]);
                                setSelectedCategories(prev => [...prev, newCat.id]);
                            }}
                        >
                            <BaseButton
                                type="button"
                                variant="text"
                                className="bg-secondary">
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
                                    className=
                                    {`md:text-md border-[2px] border-black rounded-radius-btn px-2 py-1 
                                ${selectedCategories.includes(cat.id) ? 'bg-tags' : 'bg-white'}`}
                                >
                                    {cat.title}
                                </button>
                            ) : null
                            )}
                        </div>
                    </div>

                    {/* Cancel & Save */}
                    <div className="flex justify-around mt-6">
                        {/* Cancel Button - triggers ConfirmDialog */}
                        <ConfirmDialog
                            title="Discard changes?"
                            description="This will discard all unsaved changes."
                            destructive
                            confirmText="Discard"
                            cancelText="Stay"
                            busyText="Discarding..."
                            onConfirm={handleDiscard}
                            trigger={
                                <BaseButton variant="icon" type="button" className="bg-primary focus-visible:rounded-full" aria-label="Back to all habits">
                                    <ChevronsLeft className="h-10 w-10" strokeWidth={1.5} />
                                </BaseButton>
                            }
                        />


                        <BaseButton
                            type="submit"
                            variant="icon"
                            className="bg-primary focus-visible:rounded-full"
                            aria-label="Save habit"
                            onClick={handleSave}
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            <Save className="h-10 w-10" strokeWidth={1.5} />
                        </BaseButton>
                    </div>
                </form>
            </div>
        </div>
    )
}