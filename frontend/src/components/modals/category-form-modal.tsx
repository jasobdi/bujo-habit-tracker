'use client'

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog/dialog"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import { ChevronsLeft, Save } from "lucide-react"
import { useEffect } from "react"
import { appToast } from "../feedback/app-toast"

type CategoryOutput = { id: number; title: string };
type CategoryInitial = { id?: number; title: string };

type Props = {
    /** Parent performs the API call */
    onSubmit?: (input: { title: string }) => Promise<CategoryOutput>;
    /** If no onSubmit but token: CategoryFormModal performs API call */
    token?: string;
    endpoint?: string;

    initialData?: CategoryInitial | null;
    onClose?: () => void;
    onCreated?: (category: CategoryOutput) => void;
    children?: React.ReactNode;

    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

/**
 * 
 * CategoryFormModal component allows users to create or edit a category.
 */

export function CategoryFormModal({
    onSubmit,
    token,
    endpoint = 'http://localhost:8000/api/categories',
    initialData = null,
    onClose,
    onCreated,
    children,
    open,
    onOpenChange,
}: Props) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // controlled vs uncontrolled open state
    const isControlled = open !== undefined;
    const actualOpen = isControlled ? !!open : uncontrolledOpen;
    const setOpen = (val: boolean) => {
        if (isControlled) {
            onOpenChange?.(val);
        } else {
            setUncontrolledOpen(val);
        }
    };

    // Keep title in sync with initialData
    useEffect(() => {
        setTitle(initialData?.title || '');
    }, [initialData]);

    // toasts
    const { errorToast } = appToast();

    const handleClose = (openVal: boolean) => {
        setOpen(openVal);
        if (!openVal) onClose?.();
    };

    async function submitViaParent() {
        if (!onSubmit) return;
        await onSubmit({ title });
    }

    async function submitSelfContained() {
        if (!token) throw new Error('Missing token for self-contained mode');
        const res = await fetch(endpoint, {
            method: initialData?.id ? 'PATCH' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                Accept: 'application/json'
            },
            body: JSON.stringify({ title })
        });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || 'Failed to submit category');
        }
        const json = await res.json();
        const newCategory: CategoryOutput =
            json.category ?? { id: json.id, title: json.title }; // tolerate both shapes
        onCreated?.(newCategory);
    }

    const handleSubmit = async () => {
        if (!title.trim()) return;
        setIsSubmitting(true);
        try {
            if (onSubmit) {
                await submitViaParent();
            } else {
                await submitSelfContained();
            }
            setOpen(false);
            setTitle('');
        } catch (err) {
            console.error('Failed to submit category', err);
            errorToast('Failed to submit category', undefined, 4000, 'category-submit-error');
        } finally {
            setIsSubmitting(false);
        }
    };
    const dialogTitle = initialData ? 'Edit Category' : 'Add New Category';


    return (
        <>
            {/* Inline trigger only if children provided */}
            {children ? (
                <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
                    {children}
                </div>
            ) : null}

            <Dialog open={actualOpen} onOpenChange={handleClose}>
                <DialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="flex flex-col gap-4 mt-4"
                    >
                        <label htmlFor="title" className="font-medium">
                            Category Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-[2px] border-black rounded-radius p-2"
                            placeholder="e.g. Health"
                            required
                        />

                        <div className="flex justify-around gap-4 mt-4">
                            <BaseButton
                                type="button"
                                variant="icon"
                                className="bg-primary"
                                onClick={() => handleClose(false)}
                            >
                                <ChevronsLeft className="h-10 w-10" strokeWidth={1.5} />
                            </BaseButton>

                            <BaseButton
                                type="submit"
                                variant="icon"
                                className="bg-primary"
                                disabled={isSubmitting}
                            >
                                <Save className="h-10 w-10" strokeWidth={1.5} />
                            </BaseButton>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
