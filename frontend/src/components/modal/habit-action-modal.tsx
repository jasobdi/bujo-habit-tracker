import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog/dialog";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { ChevronsLeft, Trash2, SquarePen, Ellipsis } from "lucide-react";
import { type Habit } from "@/types/habit";

export function HabitActionModal({ habit }: { habit: Habit }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Ellipsis onClick={() => setOpen(true)} />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="backdrop-blur-sm">
                    <DialogHeader>
                        <DialogTitle>{habit.title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <BaseButton variant="icon" className="bg-primary">
                            <ChevronsLeft className="w-10 h-10" />
                        </BaseButton>
                        <BaseButton variant="icon" className="bg-secondary">
                            <SquarePen className="w-10 h-10" />
                        </BaseButton>
                        <BaseButton variant="icon" className="bg-tertiary">
                            <Trash2 className="w-10 h-10" />
                        </BaseButton>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
