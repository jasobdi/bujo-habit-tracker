'use client'

import React from "react";
import { DropdownProps } from "react-day-picker";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

/**
 * CalendarDropdown component
 * Displays a custom month/year dropdown in the DashboardCalendat.
 */
export function CalendarDropdown(props: DropdownProps) {
    const { options, value, onChange } = props;

    const handleValueChange = (newValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: newValue
                }
            } as React.ChangeEvent<HTMLSelectElement>;

            onChange(syntheticEvent);
        }
    };

    return (
        <Select value={value?.toString()} onValueChange={handleValueChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
