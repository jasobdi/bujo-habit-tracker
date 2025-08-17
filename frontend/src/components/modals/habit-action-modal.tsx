import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChevronsLeft, Trash2, SquarePen, Ellipsis } from "lucide-react";
import { deleteHabit } from "@/lib/fetch/deleteHabit";
import { type Habit } from "@/types/habit";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogTrigger } from "../ui/dialog/dialog";
import { ConfirmDialog } from "../ui/dialog/confirm-dialog";
import { BaseButton } from "../ui/button/base-button/base-button";
import { appToast } from "../feedback/app-toast";

/**
 * HabitActionModal component displays a dialog with actions for a habit.
 * In this case it is used to go back, edit or delete a habit on the habits page.
 * It is opened by clicking the action button (ellipsis icon).
 */

interface HabitActionModalProps {
    habit: Habit;
    onHabitDeleted: () => void; // callback function to refresh habit list
}

export function HabitActionModal({ habit, onHabitDeleted }: HabitActionModalProps) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false); // State to manage loading during delete
    const { data: session } = useSession();
    const { successToast, errorToast } = appToast();


    const handleDelete = async () => {
        if (!session?.accessToken) {
            errorToast("Unauthenticated", "Please log in and try again.", 3500, "habit-delete-unauth");
            return;
        }

        setIsDeleting(true);
        try {
            await deleteHabit({ habit_id: habit.id, token: session.accessToken });
            successToast("Habit deleted", undefined, 2500, `habit-deleted-${habit.id}`);
            setOpen(false); // Close the action modal after deletion

            // Call the callback function to notify the parent to refresh the list
            onHabitDeleted();

        } catch (error) {
            console.error("Error deleting habit:", error);
            errorToast("Failed to delete habit", "Please try again.", 4000, `habit-delete-error-${habit.id}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            
            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                {/* Trigger to open Modal */}
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="p-2 focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-amber-500"
                        aria-label={`Open actions for ${habit.title}`}
                    >
                        <Ellipsis className="w-7 h-7" />
                    </button>
                </DialogTrigger>
                <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0 z-50" />
                <DialogContent className="flex flex-col items-center w-auto border-black border-[2px] rounded-radius z-50">
                    <DialogHeader>
                        <DialogTitle>{habit.title}</DialogTitle>
                    </DialogHeader>

                    {/* Back Button */}
                    <div className="flex glex-row gap-4 mt-4">
                        <BaseButton variant="icon" className="bg-primary focus-visible:rounded-full" onClick={() => setOpen(false)} aria-label="Back to all habits">
                            <ChevronsLeft className="w-10 h-10" strokeWidth={1.5} />
                        </BaseButton>

                        {/* Edit Button */}
                        <BaseButton asChild variant="icon" className="bg-secondary focus-visible:rounded-full">
                            <Link href={`/protected/habits/edit/${habit.id}`} aria-label="Edit habit">
                                <SquarePen className="w-10 h-10" strokeWidth={1.5} />
                            </Link>
                        </BaseButton>

                        {/* Delete Button - triggers AlertDialog */}
                        <ConfirmDialog
                            title="Delete Habit"
                            description="Are you sure you want to delete this habit? This action cannot be undone."
                            confirmText={isDeleting ? "Deleting..." : "Delete"}
                            cancelText="Cancel"
                            destructive
                            busyText="Deleting..."
                            onConfirm={handleDelete}
                            trigger={
                                <BaseButton variant="icon" className="bg-tertiary focus-visible:rounded-full" aria-label="Delete hbait">
                                    <Trash2 className="w-10 h-10" strokeWidth={1.5} />
                                </BaseButton>
                            }
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
