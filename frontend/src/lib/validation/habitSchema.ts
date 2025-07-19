// lib/validations/habitSchema.ts
import { z } from "zod";

export const habitSchema = z.object({
    title: z.string().min(1, "Title is required"),
    frequency: z.enum(["daily", "weekly", "monthly", "custom"]),
    startDate: z.date({ required_error: "Start date is required" }),
    customDays: z.array(z.string()).optional(),

    endType: z.enum(["never", "on", "after"]),
    endDate: z.date().optional(),
    repeatCount: z.number().optional(),

    categories: z.array(z.number()).min(1, "Select at least one category"),
});
