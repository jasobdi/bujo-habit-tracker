import { z } from "zod";
import { habitCommonFrequencies } from "@/types/habit";

export const habitEndTypes = ["never", "on", "after"] as const;
export type HabitEndType = typeof habitEndTypes[number];

export const habitSchema = z.object({
    title: z.string().min(1, "Title is required"),
    frequency: z.enum([...habitCommonFrequencies, 'custom']),
    startDate: z.date({ required_error: "Start date is required" }),
    customDays: z.array(z.string()).optional(),

    endType: z.enum(habitEndTypes),
    endDate: z.date().optional(),
    repeatCount: z.number().optional(),

    categories: z.array(z.number()).min(1, "Select at least one category"),
});
