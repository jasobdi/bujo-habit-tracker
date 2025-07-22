'use client'

import { DayPicker } from "react-day-picker";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { DatePickerDialog } from "@/components/ui/dialog/date-picker-dialog";

type Frequency = 'daily' | 'weekly' | 'monthly' | 'custom';
type EndType = 'never' | 'on' | 'after';

type Props = {
    frequency: Frequency | null;
    customType: 'daily' | 'weekly' | 'monthly';
    setCustomType: (val: 'daily' | 'weekly' | 'monthly') => void;
    startDate: Date | undefined;
    setStartDate: (date?: Date) => void;
    repeatInterval: number;
    setRepeatInterval: (val: number) => void;
    customDays: string[];
    toggleCustomDay: (day: string) => void;
    endType: EndType;
    setEndType: (val: EndType) => void;
    endDate: Date | undefined;
    setEndDate: (date?: Date) => void;
    repeatCount: number;
    setRepeatCount: (val: number) => void;
};

export function FrequencyFields({
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
}: Props) {
    function customFrequencyLabel() {
        if (customType === 'weekly') return 'weeks';
        if (customType === 'monthly') return 'months';
        return 'days';
    }

    return (
        <div className="border-[2px] border-black rounded-radius p-4">
            {/* start date */}
            <label htmlFor="start-date" className="font-semibold">Start date</label>
            <DatePickerDialog
                id="start-date"
                selected={startDate}
                onSelect={setStartDate}
                label="Start date" />

            {/* custom type & repeat interval */}
            {frequency === 'custom' && (
                <>
                    <div className="mt-4">
                        <label className="font-semibold">Custom type</label>
                        <div className="flex gap-2 mt-2">
                            {['daily', 'weekly', 'monthly'].map((type) => (
                                <BaseButton
                                    key={type}
                                    type="button"
                                    variant="text"
                                    className={`bg-contrast ${customType === type ? 'ring-2 ring-black' : ''}`}
                                    onClick={() => setCustomType(type as 'daily' | 'weekly' | 'monthly')}
                                    aria-label={`Set custom frequency to ${type}`}
                                >
                                    {type}
                                </BaseButton>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="repeat-interval" className="font-semibold">Repeat every</label>
                        <input
                            type="number"
                            min={1}
                            value={repeatInterval}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setRepeatInterval(isNaN(value) ? 1 : value);
                            }}
                            className="border border-black rounded ml-1 p-1 w-16"
                            id="repeat-interval"
                        />{' '}
                        {customFrequencyLabel()}
                    </div>

                    {customType === 'weekly' && (
                        <div className="mt-4">
                            <label className="font-semibold">Repeats on</label>
                            <div className="flex gap-2">
                                {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(day => (
                                    <BaseButton
                                        key={day}
                                        type="button"
                                        variant="icon"
                                        className={`bg-contrast w-10 h-10 p-2 ${customDays.includes(day) ? 'ring-2 ring-black' : ''}`}
                                        onClick={() => toggleCustomDay(day)}
                                    >
                                        {day}
                                    </BaseButton>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <label className="font-semibold">Ends</label>
                        <div className="flex flex-col gap-2 mt-2">
                            <label htmlFor="end-never">
                                <input
                                    type="radio"
                                    name="end"
                                    checked={endType === 'never'}
                                    onChange={() => setEndType('never')}
                                    id="end-never"
                                /> Never
                            </label>

                            <label htmlFor="end-date" className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="end"
                                    checked={endType === 'on'}
                                    onChange={() => setEndType('on')}
                                    id="end-date"
                                />
                                On:
                                <div
                                    onClick={() => setEndType('on')}
                                    className="ml-2"
                                >
                                    <DatePickerDialog
                                        id="end-date"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        label="End date"
                                    />
                                </div>
                            </label>

                            <label htmlFor="end-after" className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="end"
                                    checked={endType === 'after'}
                                    onChange={() => setEndType('after')}
                                    id="end-after"
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
                                        className="border border-black rounded p-1 w-16"
                                        id="end-after-count"
                                    />
                                repetitions
                            </label>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}