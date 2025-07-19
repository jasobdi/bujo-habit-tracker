import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay} from "../ui/dialog/dialog";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { ChevronsLeft, Trash2, SquarePen, Ellipsis } from "lucide-react";
import Link from "next/link";
import { type Habit } from "@/types/habit";

export function HabitActionModal({ habit }: { habit: Habit }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Ellipsis onClick={() => setOpen(true)} className="cursor-pointer" />

            <Dialog open={open} onOpenChange={setOpen}>
            <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0 z-50" />
                <DialogContent className=" flex flex-col border-black border-[2px] rounded-radius md:flex md:items-center z-50">
                    <DialogHeader>
                        <DialogTitle>{habit.title}</DialogTitle>
                    </DialogHeader>

                    <div className="flex glex-row gap-4 mt-4">
                            <BaseButton variant="icon" className="bg-primary" onClick={() => setOpen(false)}>
                                <ChevronsLeft className="w-10 h-10" />
                            </BaseButton>

                        <Link href={`/protected/habits/edit/${habit.id}`}>
                            <BaseButton variant="icon" className="bg-secondary">
                                <SquarePen className="w-10 h-10" />
                            </BaseButton>
                        </Link>
                        
                            <BaseButton variant="icon" className="bg-tertiary">
                                <Trash2 className="w-10 h-10" />
                            </BaseButton>
                        
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
