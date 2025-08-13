import { z } from "zod";
import { habitCommonFrequencies } from "@/types/habit";

export const habitEndTypes = ["never", "on", "after"] as const;
export type HabitEndType = typeof habitEndTypes[number];

export const habitSchema = z
    .object({
        title: z.string().min(1, "Title is required"),
        frequency: z.enum([...habitCommonFrequencies, "custom"]),

        
        customType: z.enum(habitCommonFrequencies).optional(),
        repeatInterval: z
            .number()
            .int({ message: "Repeat interval must be an integer" })
            .min(1, "Repeat interval must be at least 1")
            .optional(),

        startDate: z.date({ required_error: "Start date is required" }),
        customDays: z.array(z.string()).optional(),

        endType: z.enum(habitEndTypes),
        endDate: z.date().optional(),
        repeatCount: z.number().optional(),

        categories: z.array(z.number()).min(1, "Select at least one category"),
    })
    .superRefine((data, ctx) => {
        // custom: repeatInterval >= 1
        if (data.frequency === "custom") {
            if (
                data.repeatInterval == null ||
                !Number.isInteger(data.repeatInterval) ||
                data.repeatInterval < 1
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["repeatInterval"],
                    message: "Repeat interval must be at least 1",
                });
            }
        }

        // custom weekly: at least 1 weekday selected
        if (data.frequency === "custom" && data.customType === "weekly") {
            if (!data.customDays || data.customDays.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["customDays"],
                    message: "Select at least one weekday",
                });
            }
        }

        // endType: on - endDate is required
        if (data.endType === "on" && !data.endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message: "End date is required",
            });
        }
        // endType: after - repeatCount >= 1
        if (data.endType === "after") {
            if (data.repeatCount == null || !Number.isInteger(data.repeatCount) || data.repeatCount < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["repeatCount"],
                    message: "Repeat count must be at least 1",
                });
            }
        }
    });