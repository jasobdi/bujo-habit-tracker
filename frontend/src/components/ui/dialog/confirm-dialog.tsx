"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog/alert-dialog";
import { BaseButton } from "@/components/ui/button/base-button/base-button";

type ConfirmDialogProps = {
    
    title: React.ReactNode;
    description?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => Promise<void> | void;
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    destructive?: boolean;
    className?: string;
    busyText?: string;
};

export function ConfirmDialog({
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    trigger,
    open,
    onOpenChange,
    destructive = false,
    className = "",
    busyText = "Please wait…",
}: ConfirmDialogProps) {
    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const actualOpen = isControlled ? (open as boolean) : internalOpen;
    const setOpen = onOpenChange ?? setInternalOpen;

    const [busy, setBusy] = useState(false);

    const handleConfirm = async () => {
        try {
            setBusy(true);
            await onConfirm();
            setOpen(false);
        } finally {
            setBusy(false);
        }
    };

    return (
        <AlertDialog open={actualOpen} onOpenChange={setOpen}>
            {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}

            <AlertDialogContent className={`border-[2px] border-black rounded-radius backdrop-blur-sm max-w-sm mx-auto p-6 ${className}`}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description ? (
                        <AlertDialogDescription>{description}</AlertDialogDescription>
                    ) : null}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <BaseButton type="button" variant="text" className="bg-contrast text-black">
                            {cancelText}
                        </BaseButton>
                    </AlertDialogCancel>

                    <AlertDialogAction asChild>
                        <BaseButton
                            variant="text"
                            type="button"
                            onClick={handleConfirm}
                            disabled={busy}
                            className={destructive ? "bg-tertiary text-black" : "bg-contrast text-black"}
                        >
                            {busy ? busyText : confirmText}
                        </BaseButton>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}