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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog/alert-dialog";
import { habitCommonFrequencies, HabitCommonFrequency, HabitCustomDays } from "@/types/habit";

const frequencies = [...habitCommonFrequencies, 'custom'] as const;
type Frequency = typeof frequencies[number];

export default function NewHabit() {
    const router = useRouter();
    const { data: session } = useSession();


    // define frequency options

    // states for custom frequency
    const [customType, setCustomType] = useState<HabitCommonFrequency>('daily');
    const [repeatInterval, setRepeatInterval] = useState<number>(1);

    // states for the form
    const [titleError, setTitleError] = useState<string|undefined>(undefined);
    const [startDateError, setStartDateError] = useState<string|undefined>(undefined);
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [customDays, setCustomDays] = useState<HabitCustomDays[]>([]);
    const [endType, setEndType] = useState<'never' | 'on' | 'after'>('never');
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [repeatCount, setRepeatCount] = useState<number>(1);

    // state for confirmation dialog
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    /* Form handling */
    // handle frequency change
    function toggleCustomDay(day: HabitCustomDays) {
        setCustomDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }

    function getErrorMessageForField(errors: z.ZodError, field: string): string|undefined {
        
        if (!errors) return undefined; // no error found

        // check if input field has error
        for (const error of errors.errors) {
                console.error(error.message)
            if (error.path.includes(field)) {
                return error.message; // has error -> return error message from zod
            }
        }
        return undefined; // no error found

    }

    // cancel-button handler
    function handleCancel(e: React.MouseEvent) {
        e.preventDefault();
        setIsCancelConfirmOpen(true); // Open the AlertDialog
    };

    // save-button handler
    async function handleSave(e: React.MouseEvent) {
        e.preventDefault();

        // check for session and accessToken
        if (!session?.accessToken) {
            alert("Not authenticated.");
            return;
        }

        // // Basic Validation
        // if (!title.trim()) {
        //     alert("Please enter a title.");
        //     return;
        // }

        // if (!frequency) {
        //     alert("Please select a frequency.");
        //     return;
        // }

        // if (!startDate) {
        //     alert("Please select a start date.");
        //     return;
        // }

        // if (frequency === 'custom' && customDays.length === 0) {
        //     alert("Please select at least one custom day.");
        //     return;
        // }

        // if (endType === 'on' && !endDate) {
        //     alert("Please select an end date.");
        //     return;
        // }

        // if (endType === 'after' && repeatCount <= 0) {
        //     alert("Repeat count must be greater than 0.");
        //     return;
        // }

        // validation with Zod schema
        try {
            // pass the raw date objects to the zod schema for validation
            const validated = habitSchema.parse({
                title,
                frequency,
                startDate: startDate,
                customDays: frequency === "custom" ? customDays : [],
                endType,
                endDate: endType === "on" && endDate ? endDate : undefined, // Pass the Date object directly
                repeatCount: endType === "after" ? repeatCount : undefined,
                categories: selectedCategories,
            });

            // prepare data for API call, formatting dates and remaining fields here
            const apiData: { [key: string]: any } = { 
                title: validated.title,
                frequency:  validated.frequency === 'custom' ? `custom_${customType}` : validated.frequency,
                start_date: format(validated.startDate, 'yyyy-MM-dd'), // Renamed to start_date
                custom_days: validated.customDays, // Renamed to custom_days
                category_ids: validated.categories, // Renamed to category_ids
                repeat_interval: validated.frequency === 'custom' ? repeatInterval : 1, // Renamed to repeat_interval
                repeat_count: validated.repeatCount, // Renamed to repeat_count
            };

            // Handle end date based on endType
            if (validated.endType === "on" && validated.endDate) {
                apiData.end_date = format(validated.endDate, 'yyyy-MM-dd'); // Renamed to end_date
            }

            // API call to create the habit
            const response = await createHabit(apiData, session.accessToken);

            console.log("Habit created:", response);

            // after successful creation, redirect to habits page
            router.push('/protected/habits');

        } catch (error) {
            if (error instanceof z.ZodError) {
                setTitleError(getErrorMessageForField(error,'title'));
                setStartDateError(getErrorMessageForField(error, 'startDate'));
                
                console.error("Validation errors:", error.flatten());
                console.error("Validation issues (detailed):", error.issues);
            } else {
                console.error("Failed to create habit:", error);
                alert("Something went wrong while saving.");
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
    const [categoriesUpdated, setCategoriesUpdated] = useState(0);

    // load categories from API
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

    // create a category through the modal & update the category-tag list
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

            const result = await res.json(); // read JSON-response
            const newCategory: Category = result.category; // grab nested Category object

            setAvailableCategories(prev => [...prev, newCategory]); // add newly created category to the list
            setSelectedCategories(prev => [...prev, newCategory.id]); // add newly created category to the selected categories
            setCategoriesUpdated(prev => prev + 1); // trigger re-fetch of categories
            
            return newCategory;

        } catch (error) {
            console.error("Failed to create category:", error);
            throw error;
            // later: error handling for user
        }
    };

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
                <label htmlFor="title" className="font-semibold"> Title
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full border-[2px] border-black rounded-radius mt-2 mb-4 p-2 font-normal ${titleError ? 'border-error' : ''}`}
                    />
                    {titleError?<p>{titleError}</p>:null}
                </label>

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
                                onClick={() => setFrequency(f)}
                            >
                                {f}
                            </BaseButton>
                        ))}
                    </div>
                </div>

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
                />

                <div className="mt-4">
                    <label className="font-semibold md:text-md">Categories</label>
                    <br />

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

                <div className="flex justify-around mt-6">
                    {/* Cancel Button - triggers AlertDialog */}
                    <AlertDialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
                        <AlertDialogTrigger asChild>
                            <BaseButton
                                variant="icon"
                                type="button"
                                className="bg-primary"
                                onClick={handleCancel}
                            >
                                <ChevronsLeft className="h-10 w-10" strokeWidth={1.5} />
                            </BaseButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to discard this habit?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action will discard all unsaved changes for this habit.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        router.push('/protected/habits');
                                    }}
                                    className="text-black font-semibold bg-tertiary"
                                >
                                    Discard
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>



                    <BaseButton
                        type="submit"
                        variant="icon"
                        className="bg-primary"
                        onClick={handleSave}
                    >
                        <Save className="h-10 w-10" strokeWidth={1.5} />
                    </BaseButton>
                </div>
            </form>
        </div>
    );
}