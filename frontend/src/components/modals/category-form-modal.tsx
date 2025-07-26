'use client'

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog/dialog"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import { ChevronsLeft, Save } from "lucide-react"
import { useSession } from 'next-auth/react'
import { useEffect } from "react"

type CategoryData = {
    id?: number; // optional
    title: string;
}

type CategoryFormModalProps = {
    initialData: CategoryData | null;
    onSubmit: (category: CategoryData) => void; // callback when form submitted
    onClose?: () => void; // optional callback when modal closes
    children?: React.ReactNode; // trigger button
}

export function CategoryFormModal({ initialData, onSubmit, onClose, children }: CategoryFormModalProps) {
    const { data: session } = useSession();
    const [title, setTitle] = useState(initialData?.title || "");
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
        } else {
            setTitle(""); 
        }
    }, [initialData]);

    // set titel when initialData changes (update)
    useEffect(() => {
        if (initialData && !children) { 
            setIsOpen(true);
        }
    }, [initialData, children]);

    // close modal, also calls onClose callback
    const handleClose = (open: boolean) => {
        setIsOpen(open);
        if (!open && onClose) {
            onClose();
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;

        setIsSubmitting(true);

        try {
            // API call is being handeled in the parent component
            await onSubmit({ id: initialData?.id, title });
            handleClose(false); // close modal
            setTitle(''); // reset title

        } catch (err) {
            console.error("Failed to submit category", err);
            // Fehlerbehandlung

        } finally {
            setIsSubmitting(false);
        }
    };

    const dialogTitle = initialData ? "Edit Category" : "Add New Category";


    return (
        <>
        <div onClick={() => handleClose(true)} className="inline-block cursor-pointer">
            {children}
        </div>
            

            <Dialog open={isOpen} onOpenChange={handleClose}>
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
                        <label htmlFor="title" className="font-medium">Category Title</label>
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
                                onClick={() => handleClose(false)}>
                                <ChevronsLeft className="h-10 w-10" strokeWidth={1.5}/>
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
    )
}
