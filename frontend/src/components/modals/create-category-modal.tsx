'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog/dialog"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import { Plus, ChevronsLeft, Save } from "lucide-react"
import { useSession } from 'next-auth/react'

type CreateCategoryModalProps = {
    onCreate: (newCategory: { id: number, title: string }) => void;
}

export function CreateCategoryModal({ onCreate }: CreateCategoryModalProps) {
    const { data: session } = useSession();
    const [title, setTitle] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) return;

        setIsSubmitting(true);

        try {
            const res = await fetch("http://localhost:8000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ title })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            const newCategory = await res.json();

            onCreate(newCategory);  // calls callback to update parent state
            setIsOpen(false);       // close the dialog
            setTitle('');
        } catch (err) {
            console.error("Failed to create category", err);
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <>
            <BaseButton
                type="button"
                variant="text"
                className="bg-secondary"
                onClick={() => setIsOpen(true)}
            >
                <Plus className="w-4 h-4 mr-1" />
                add category
            </BaseButton>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(); // API call
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
                                onClick={() => setIsOpen(false)}>
                                <ChevronsLeft className="h-10 w-10" />
                            </BaseButton>

                            <BaseButton 
                                type="submit" 
                                variant="icon" 
                                className="bg-primary"
                                disabled={isSubmitting}
                                >
                                <Save className="h-10 w-10" />
                            </BaseButton>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
