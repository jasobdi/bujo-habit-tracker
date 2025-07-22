'use client'

import { useState } from "react"
import { Dialog, DialogTrigger, DialogTitle, DialogContent } from "./dialog"
import { DayPicker } from "react-day-picker"
import { format, parse, isValid } from "date-fns"
import { Calendar1 } from "lucide-react"

type Props = {
    selected?: Date
    onSelect: (date?: Date) => void
    label?: string
    id: string
}

export function DatePickerDialog({ selected, onSelect, label = "Pick a date", id }: Props) {
    const [inputValue, setInputValue] = useState(
        selected ? format(selected, "dd/MM/yyyy") : ""
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)

        const parsed = parse(e.target.value, "dd/MM/yyyy", new Date())
        if (isValid(parsed)) {
            onSelect(parsed)
        }
    }

    const handleDaySelect = (date?: Date) => {
        if (date) {
            setInputValue(format(date, "dd/MM/yyyy"))
            onSelect(date)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <input
                id={id}
                type="text"
                className="border border-black rounded p-2 w-full"
                placeholder="dd/mm/yyyy"
                value={inputValue}
                onChange={handleInputChange}
                aria-label={label}
            />

            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="p-2 border border-black rounded bg-contrast"
                        aria-label={`Open calendar to select ${label.toLowerCase()}`}
                    >
                        <Calendar1 className="w-5 h-5" />
                    </button>
                </DialogTrigger>
                <DialogContent className="p-4">
                <DialogTitle className="sr-only">{label}</DialogTitle>
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleDaySelect}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
