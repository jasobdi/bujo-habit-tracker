'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BaseButton } from '@/components/ui/button/base-button/base-button';
import { Save, ChevronsLeft, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, AlertDialogTrigger, AlertDialogFooter } from '@/components/ui/alert-dialog/alert-dialog';
import { CategoryFormModal } from '@/components/modals/category-form-modal';
import { FrequencyFields } from '@/components/forms/create-habit/frequency-fields';
import { useSession } from 'next-auth/react';
import { HabitEndType, habitSchema } from '@/lib/validation/habitSchema';
import { format, parseISO } from 'date-fns'; // parseISO for Date-Strings
import { updateHabit } from '@/lib/fetch/updateHabit';
import { habitCommonFrequencies, HabitCommonFrequency } from '@/types/habit';


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

    // state for confirmation dialog
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    /* Category handling */
    type Category = {
        id: number;
        title: string;
    }

    // state for Categories
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);


    const fetchHabitData = async () => {
        if (!session?.accessToken || !habitId) {
            console.error('Habit-ID or Access Token missing.');
            return;
        }

        const numericHabitId = parseInt(habitId, 10);

        // Check if convert to number was successful and if habitId is a valid number
        if (isNaN(numericHabitId)) {
            console.error('Habit-ID is not valid.');
            return;
        }

        try {
            const res = await fetch(`http://localhost:8000/api/habits/${habitId}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: 'application/json',
                },
            });

            if (!res.ok) {
                console.error('Failed to fetch habit data');
                return;
            }

            const habitData = await res.json();

            setTitle(habitData.title);
            setFrequency(habitData.frequency as Frequency);
            setStartDate(parseISO(habitData.start_date));
            if (habitData.frequency === 'custom' && habitData.custom_days) {
                setCustomDays(habitData.custom_days);
            }
            if (habitData.end_date) {
                setEndType('on');
                setEndDate(parseISO(habitData.end_date));
            } else if (habitData.repeat_count) {
                setEndType('after');
                setRepeatCount(habitData.repeat_count);
            } else {
                setEndType('never');
            }
            setSelectedCategories(habitData.categories.map((cat: Category) => cat.id));
        } catch (err) {
            console.error("Error fetching habit data", err);
        }
    };

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

    // handle form data from API
    useEffect(() => {
        if (session?.accessToken) {
            fetchCategories(); // load categories
            fetchHabitData(); // load habit data
        }
    }, [session?.accessToken, habitId]);


    /* Form handling */
    function toggleCustomDay(day: string) {
        setCustomDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }

    function handleCancel(e: React.MouseEvent) {
        e.preventDefault();
        setIsCancelConfirmOpen(true);
    };

    async function handleSave(e: React.MouseEvent) {
        e.preventDefault();
        if (!session?.accessToken || !habitId) {
            alert("Not authenticated or habit ID is missing.");
            return;
        }

        try {
            const validated = habitSchema.parse({
                title,
                frequency,
                startDate: startDate,
                customDays: frequency === "custom" ? customDays : [],
                endType,
                endDate: endType === "on" && endDate ? endDate : undefined,
                repeatCount: endType === "after" ? repeatCount : undefined,
                categories: selectedCategories,
            });

            const apiData: { [key: string]: any } = {
                title: validated.title,
                frequency:  validated.frequency === 'custom' ? `custom_${customType}` : validated.frequency,
                start_date: format(validated.startDate, 'yyyy-MM-dd'), // Renamed to start_date
                custom_days: validated.customDays, // Renamed to custom_days
                category_ids: validated.categories, // Renamed to category_ids
                repeat_interval: validated.frequency === 'custom' ? repeatInterval : 1, // Renamed to repeat_interval
                repeat_count: validated.repeatCount, // Renamed to repeat_count
            };

            if (validated.endType === "on" && validated.endDate) {
                apiData.end_date = format(validated.endDate, 'yyyy-MM-dd');
            } else if (validated.endType === 'after' && validated.repeatCount !== undefined) {
                apiData.repeat_interval = validated.repeatCount;
            } else {
                // Bei endType 'never' müssen wir end_date und repeat_interval löschen
                apiData.end_date = null;
                apiData.repeat_interval = null;
            }

            const numericHabitId = parseInt(habitId, 10);

            if (isNaN(numericHabitId)) {
                console.error('Ungültige Habit-ID.');
                return;
            }

            // API call to update habit
            const response = await updateHabit(numericHabitId, apiData, session.accessToken);

            console.log("Habit updated:", response);
            router.push('/protected/habits');

        } catch (error) {
            // ... Fehlerbehandlung
        }
    }

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
            console.log("Die API hat folgendes Objekt zurückgegeben:", newCategory);

            setAvailableCategories(prev => [...prev, newCategory]); // add newly created category to the list
            setSelectedCategories(prev => [...prev, newCategory.id]); // add newly created category to the selected categories
            
            console.log("Neue Kategorie erstellt und als ausgewählt gesetzt:", newCategory.id);

            return newCategory;

        } catch (error) {
            console.error("Failed to create category:", error);
            throw error;
            // later: error handling for user
        }
    };

    // toogle for category selection
    function toggleCategory(id: number) {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(catId => catId !== id)
                : [...prev, id]
        );
    }

    // loading state handling
    if (!habitId) {
        return <div>Ladefehler: Habit-ID fehlt.</div>;
    }
    if (!session?.accessToken || !title) {
        return <div>Lade Daten...</div>;
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
                        className="w-full border-[2px] border-black rounded-radius mt-2 mb-4 p-2 font-normal"
                    />
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


                {FrequencyFields({
                    frequency,
                    customType,
                    setCustomType,
                    startDate: startDate,
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
                    setRepeatCount,
                    isEditing: true, // this is an edit form
                })}

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
                                <AlertDialogTitle>Are you sure you want to discard your changes?</AlertDialogTitle>
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
    )
}