'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog/dialog"
import { BaseButton } from "@/components/ui/button/base-button/base-button"
import { Plus, ChevronsLeft, Save } from "lucide-react"

type CreateCategoryModalProps = {
    onCreate: (newCategory: { id: number, title: string }) => void;
}

export function CreateCategoryModal({ onCreate }: CreateCategoryModalProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    async function handleCreate() {
        try { // post request to create a new category
            const res = await fetch('/api/categories', {
                method: 'POST',
                body: JSON.stringify({ title }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();

            // give data to the parent component
            onCreate(data);
            setOpen(false);
            setTitle('');
        } catch (error) {
            console.error('Error creating category:', error);
        }
    }


    return (
        <>
            <BaseButton
                type="button"
                variant="text"
                className="bg-secondary"
                onClick={() => setOpen(true)}
            >
                <Plus className="w-4 h-4 mr-1" />
                Add Category
            </BaseButton>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-md mx-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            console.log("New Category:", title)
                            // TODO: API Call oder Server Action einfügen
                            setOpen(false)
                            setTitle("")
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
                                onClick={() => setOpen(false)}>
                                <ChevronsLeft className="h-10 w-10" />
                            </BaseButton>

                            <BaseButton type="submit" variant="icon" className="bg-primary">
                                <Save className="h-10 w-10" />
                            </BaseButton>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
