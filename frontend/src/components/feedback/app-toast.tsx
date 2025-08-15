"use client";

import type { ComponentType } from "react";
import { CircleCheckBig, Info, TriangleAlert, CircleX } from "lucide-react";
import { toast } from "sonner";

type Variant = "success" | "info" | "warning" | "error";

const ICONS: Record<Variant, ComponentType<{ className?: string }>> = {
    success: CircleCheckBig,
    info: Info,
    warning: TriangleAlert,
    error: CircleX,
};

// Styling
const BASE = "border-[2px] rounded-radius shadow-sm";
const COLORS: Record<Variant, string> = {
    success: "bg-[var(--completed)] text-black border-black",
    info: "bg-[var(--primary)] text-black border-black",
    warning: "bg-[var(--tertiary)] text-black border-black",
    error: "bg-[var(--tertiary)] text-black border-black",
};

type ShowArgs = {
    title: string;
    description?: string;
    variant?: Variant;
    duration?: number;
    actionLabel?: string;
    onAction?: () => void;
    id?: string | number; // optional: dedupe-id
};

/**
 * appToast component is a custom toast notification system for user feedback
 * It can return different types of notifications like success, info, warning, and error.
 * 
 */

export function appToast() {
    function show({
        title,
        description,
        variant = "success",
        duration = 3000,
        actionLabel,
        onAction,
        id,
    }: ShowArgs) {
        const Icon = ICONS[variant];

        const VARIANT_STYLE: Record<Variant, React.CSSProperties> = {
            success: {
                backgroundColor: "var(--completed)",
                color: "black",
                border: "2px solid black",
                borderRadius: "var(--radius, 0.375rem)",
            },
            info: {
                backgroundColor: "var(--primary)",
                color: "black",
                border: "2px solid black",
                borderRadius: "var(--radius, 0.375rem)",
            },
            warning: {
                backgroundColor: "var(--tertiary)",
                color: "black",
                border: "2px solid black",
                borderRadius: "var(--radius, 0.375rem)",
            },
            error: {
                backgroundColor: "var(--tertiary)",
                color: "black", 
                border: "2px solid black",
                borderRadius: "var(--radius, 0.375rem)",
            },
        };

        toast(title, {
            id,
            description: description ? <span className="text-black">{description}</span> : undefined,
            duration,
            className: `${BASE} ${COLORS[variant]}`,
            style: VARIANT_STYLE[variant],
            icon: <Icon className="w-5 h-5 text-current" aria-hidden="true" />,
            action:
                actionLabel && onAction
                    ? { label: actionLabel, onClick: onAction }
                    : undefined,
            closeButton: true,
        });
    }

    // Shortcuts for different variants
    const successToast = (
        title: string,
        description?: string,
        duration?: number,
        id?: string | number
    ) => show({ title, description, duration, id, variant: "success" });

    const errorToast = (
        title: string,
        description?: string,
        duration?: number,
        id?: string | number
    ) => show({ title, description, duration, id, variant: "error" });

    const infoToast = (
        title: string,
        description?: string,
        duration?: number,
        id?: string | number
    ) => show({ title, description, duration, id, variant: "info" });

    const warningToast = (
        title: string,
        description?: string,
        duration?: number,
        id?: string | number
    ) => show({ title, description, duration, id, variant: "warning" });

    return { show, successToast, errorToast, infoToast, warningToast };
}