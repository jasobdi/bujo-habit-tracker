"use client";

import { Info, CircleCheckBig, TriangleAlert, CircleX } from "lucide-react";
import { useState, useEffect, useId } from "react";

type NoticeVariant = "info" | "success" | "warning" | "error";

const ICONS = {
    info: Info,
    success: CircleCheckBig,
    warning: TriangleAlert,
    error: CircleX,
} as const;

const WRAPPER = "border-[2px] border-black rounded-radius shadow-sm";
const VARIANTS: Record<NoticeVariant, string> = {
    info: "bg-[var(--primary)] border-black text-blue-700",
    success: "bg-[var(--completed)] border-black text-green-700",
    warning: "bg-[var(--tertiary)] border-black text-red-700",
    error: "bg-[var(--tertiary)] border-black text-red-700",
};

export function InlineNotice({
    variant = "info",
    children,
    storageKey,
    defaultOpen = true,
    className = "",
}: {
    variant?: NoticeVariant;
    children?: React.ReactNode;
    storageKey?: string;
    defaultOpen?: boolean;
    className?: string;
}) {
    const [hydrated, setHydrated] = useState(false);
    const reactId = useId();
    const panelId = `notice-${variant}-${reactId}`;

    const readState = (): { open: boolean; minimized: boolean } => {
        if (typeof window === "undefined" || !storageKey) {
            return { open: defaultOpen, minimized: !defaultOpen };
        }
        const v = localStorage.getItem(storageKey);
        if (v === "min") return { open: false, minimized: true };
        if (v === "open") return { open: true, minimized: false };
        return { open: defaultOpen, minimized: !defaultOpen };
    };

    const [state, setState] = useState(readState);
    useEffect(() => {
        setHydrated(true);
        setState(readState());
    }, []);

    const setOpen = (open: boolean) => {
        setState({ open, minimized: !open });
        if (storageKey) localStorage.setItem(storageKey, open ? "open" : "min");
    };

    const Icon = ICONS[variant];

    const role = variant === "error" || variant === "warning" ? "alert" : "status";
    const ariaLive = role === "status" ? "polite" : undefined;

    if (!hydrated) return null;

    /** minimized panel */
    if (state.minimized) {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Show ${variant} message`}
                aria-expanded="false"
                aria-controls={panelId}
                className={[
                    "inline-flex items-center gap-2 px-3 py-2 select-none transition-opacity",
                    "bg-white text-black",
                    WRAPPER,
                    className,
                ].join(" ")}
                title="Show info"
            >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm">Info</span>
            </button>
        );
    }

    /** open panel */
    return (
        <div
            id={panelId}
            className={[
                "flex items-start gap-3 px-4 py-3",
                WRAPPER,
                VARIANTS[variant],
                className,
            ].join(" ")}
            role={role}
            aria-live={ariaLive}
        >
            <Icon className="w-5 h-5 flex-none mt-0.5" aria-hidden="true" />
            <div className="text-sm md:text-base leading-relaxed flex-1">
                {children}
            </div>
            <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={`Dismiss ${variant} message`}
                aria-expanded="true"
                aria-controls={panelId}
                className="flex-none -m-1 p-1 rounded-radius hover:opacity-80 transition-opacity"
                title="Close"
            >
                <CircleX className="w-5 h-5" />
            </button>
        </div>
    );
}