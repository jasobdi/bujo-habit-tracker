'use client'

import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { DayPicker } from "react-day-picker";
import { CategoryTag } from "@/components/category-tag/category-tag";
import { ChevronsLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewHabit() {
    return (
        <form action="">
            <label htmlFor="">Title</label>
            <input type="text" />

            <label htmlFor="">Frequency</label>
            <BaseButton variant="text" className="bg-contrast">daily</BaseButton>
            <BaseButton variant="text" className="bg-contrast">weekly</BaseButton>
            <BaseButton variant="text" className="bg-contrast">monthly</BaseButton>
            <BaseButton variant="text" className="bg-contrast">custom</BaseButton>

            <section className="border-black border-[2px] border-radius">
                <label htmlFor="">Start date</label>
                <DayPicker></DayPicker>

                <label htmlFor="">Custom Days</label>
                <input type="checkbox" />

                <label htmlFor="">Ends on</label>
                <input type="radio" /><p>never</p>
                <input type="radio" /><p>on</p><DayPicker />
                <input type="radio" /><p>after X repeats</p>
            </section>
            <label htmlFor="">Category</label>
            <BaseButton variant="text" className="bg-secondary"></BaseButton>
            <CategoryTag></CategoryTag>

            <Link href="/protected/habits">
                <BaseButton variant="icon">
                    <ChevronsLeft className="h-10 w-10" />
                </BaseButton>
            </Link>

            <Link href="/protected/habit">
                <BaseButton variant="icon">
                    <Save className="h-10 w-10" />
                </BaseButton>
            </Link>

        </form>
    )
}