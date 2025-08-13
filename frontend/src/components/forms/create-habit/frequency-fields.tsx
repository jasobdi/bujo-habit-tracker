'use client'

import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { DatePickerDialog } from "@/components/ui/dialog/date-picker-dialog";
import { habitCommonFrequencies, HabitCommonFrequency, habitCustomDays, HabitCustomDays } from "@/types/habit";
import { HabitEndType } from "@/lib/validation/habitSchema";
import { format } from "date-fns";

type Props<T extends string, S extends string> = {
    frequency: T | null;
    customType: HabitCommonFrequency;
    setCustomType: (val: HabitCommonFrequency) => void;
    startDate: Date | undefined;
    setStartDate: (date?: Date) => void;
    repeatInterval: number;
    setRepeatInterval: (val: number) => void;
    customDays: S[];
    toggleCustomDay: (day: HabitCustomDays) => void;
    endType: HabitEndType;
    setEndType: (val: HabitEndType) => void;
    endDate: Date | undefined;
    setEndDate: (date?: Date) => void;
    repeatCount: number;
    setRepeatCount: (val: number) => void;
    isEditing?: boolean; // optional prop for edit mode
    startDateError?: string;
    customDaysError?: string;
    endDateError?: string;
    repeatCountError?: string;
    repeatIntervalError?: string;
};

/**
 * FrequencyFields component allows users to set the frequency of a habit.
 * In this case it is used in the NewHabit form and the EditHabit form.
 */

export function FrequencyFields<T extends string, S extends string>({
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
    setRepeatCount,
    isEditing = false,
    startDateError,
    customDaysError,
    endDateError,
    repeatCountError,
    repeatIntervalError,
}: Props<T, S>) {
    function customFrequencyLabel() {
        if (customType === 'weekly') return 'weeks';
        if (customType === 'monthly') return 'months';
        return 'days';
    }

    const mapDay = (day: HabitCustomDays) => {
        switch (day) {
            case 'Monday': return 'MO';
            case 'Tuesday': return 'TU';
            case 'Wednesday': return 'WE';
            case 'Thursday': return 'TH';
            case 'Friday': return 'FR';
            case 'Saturday': return 'SA';
            case 'Sunday': return 'SU';
            default: return '';
        }
    }

    const handleRepeatIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setRepeatInterval(isNaN(value) ? 1 : value);
    }

    return (
        <div className="border-[2px] border-black rounded-radius p-4">
            {/* start date */}
            {isEditing && (
                <div className="mb-4">
                    <label className="font-semibold md:text-md">Start Date</label>
                    <p className="mt-2">{startDate ? format(startDate, 'PPP') : 'Loading...'}</p>
                </div>
            )}
            {!isEditing && (
                <div className={`${startDateError ? 'border-error' : ''}`}>
                    <label htmlFor="start-date" className={`font-semibold md:text-md `}>Start date</label>
                    <DatePickerDialog
                        id="start-date"
                        selected={startDate}
                        onSelect={setStartDate}
                        label="Start date"
                        hasError={!!startDateError}
                    />
                    {startDateError ? <p className="text-sm text-[var(--error)] font-normal">{startDateError}</p> : null}
                </div>
            )}

            {/* custom type & repeat interval */}
            {frequency === 'custom' && (
                <>
                    <div className="mt-4">
                        <label className="font-semibold md:text-md">Custom type</label>
                        <div className="flex flex-col w-auto md:flex-row md:gap-1 mt-2 mb-3">
                            {habitCommonFrequencies.map((type) => (
                                <BaseButton
                                    key={type}
                                    type="button"
                                    variant="text"
                                    className={`text-sm md:text-lg px-4 py-2 m-2 border-[2px] border-black rounded-radius 
                                        ${customType === type ? 'bg-primary' : 'bg-contrast text-black'}`}
                                    onClick={() => setCustomType(type)}
                                    aria-label={`Set custom frequency to ${type}`}
                                >
                                    {type}
                                </BaseButton>
                            ))}
                        </div>
                    </div>

                    <div className="my-4">
                        <label htmlFor="repeat-interval" className="font-semibold md:text-md">Repeat every</label>
                        <input
                            type="number"
                            min={1}
                            value={repeatInterval}
                            onChange={handleRepeatIntervalChange}
                            className={`border border-black rounded ml-2 p-1 w-16 md:text-md ${repeatIntervalError ? 'ring-2 ring-[var(--error)]' : ''
                                }`}
                            id="repeat-interval"
                            aria-invalid={!!repeatIntervalError}
                            aria-describedby={repeatIntervalError ? "repeat-interval-error" : undefined}
                        />{' '}
                        {customFrequencyLabel()}
                        {repeatIntervalError ? <p id="repeat-interval-error" className="mt-2 text-sm text-[var(--error)]">{repeatIntervalError}</p> : null}
                    </div>

                    {customType === 'weekly' && (
                        <div className="mt-4">
                            <label className="font-semibold md:text-md">Repeats on</label>
                            <div
                                className={`flex gap-1 mt-2 ${customDaysError ? 'ring-2 ring-[var(--error)] rounded-radius p-1' : ''
                                    }`}
                                aria-invalid={!!customDaysError}
                                aria-describedby={customDaysError ? 'custom-days-error' : undefined}
                                role="group"
                            >
                                {habitCustomDays.map(day => (
                                    <BaseButton
                                        key={day}
                                        type="button"
                                        variant="icon"
                                        className={`bg-contrast w-8 h-8 md:w-10 md:h-10 p-2 text-xs md:text-sm ${(customDays as string[]).includes(day) ? 'bg-primary' : 'bg-contrast text-black'}`}
                                        onClick={() => toggleCustomDay(day)}
                                        aria-pressed={(customDays as string[]).includes(day)}
                                    >
                                        {mapDay(day)}
                                    </BaseButton>
                                ))}
                            </div>
                            {customDaysError ? <p id="custom-days-error" className="mt-2 text-sm text-[var(--error)] font-normal">{customDaysError}</p> : null}
                        </div>
                    )}

                    <div className="mt-4">
                        <label className="font-semibold md:text-md">Ends</label>
                        <div className="flex flex-col gap-2 mt-2">
                            <label htmlFor="end-never">
                                <input
                                    type="radio"
                                    name="end"
                                    checked={endType === 'never'}
                                    onChange={() => setEndType('never')}
                                    id="end-never"
                                    className="md:text-md"
                                /> Never
                            </label>

                            <label htmlFor="end-date" className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="end"
                                    checked={endType === 'on'}
                                    onChange={() => setEndType('on')}
                                    id="end-date"
                                    className="md:text-md"
                                />
                                On:
                                <div
                                    onClick={() => setEndType('on')}
                                    className="ml-2 md:text-md"
                                >
                                    <DatePickerDialog
                                        id="end-date"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        label="End date"
                                        hasError={!!endDateError}
                                    />
                                </div>
                            </label>
                            {endDateError ? <p className="mt-2 text-sm text-[var(--error)] font-normal">{endDateError}</p> : null}

                            <label htmlFor="end-after" className="flex items-center gap-2 md:text-md">
                                <input
                                    type="radio"
                                    name="end"
                                    checked={endType === 'after'}
                                    onChange={() => setEndType('after')}
                                    id="end-after"
                                    className="md:text-md"
                                />
                                After:
                                <input
                                    type="number"
                                    min={1}
                                    value={repeatCount}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setRepeatCount(isNaN(value) ? 1 : value);

                                    }}
                                    onFocus={() => setEndType('after')}
                                    className={`border border-black rounded p-1 w-16 md:text-md ${
                                        repeatCountError ? 'ring-2 ring-[var(--error)]' : ''
                                    }`}
                                    id="end-after-count"
                                    aria-invalid={!!repeatCountError}
                                    aria-describedby={repeatCountError ? 'end-after-count-error' : undefined}
                                />
                                repetitions
                            </label>
                            {repeatCountError ? <p id="end-after-count-error" className="mt-2 text-sm text-[var(--error)] font-normal">{repeatCountError}</p> : null}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}