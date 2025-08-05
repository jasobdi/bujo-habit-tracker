import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay} from "../ui/dialog/dialog";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { ChevronsLeft, Trash2, SquarePen, Ellipsis } from "lucide-react";
import { useSession } from "next-auth/react";
import { deleteHabit } from "@/lib/fetch/deleteHabit";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "./../ui/alert-dialog/alert-dialog";
import Link from "next/link";
import { type Habit } from "@/types/habit";

interface HabitActionModalProps {
    habit: Habit;
    onHabitDeleted: () => void; // callback function to refresh habit list
}

/**
 * 
 * HabitActionModal component displays a modal with actions for a habit.
 * In this case it is used to go back, edit or delete a habit on the habits page.
 */

export function HabitActionModal({ habit, onHabitDeleted }: HabitActionModalProps) {
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false); // State to manage loading during delete
    const { data: session } = useSession(); 


    const handleDelete = async () => {
        if (!session?.accessToken) {
            alert("Unauthenticated."); 
            return;
        }

        setIsDeleting(true);
        try {
            await deleteHabit({ habit_id: habit.id, token: session.accessToken });
            console.log("Habit deleted successfully!");
            setOpen(false); // Close the action modal after deletion

            // Call the callback function to notify the parent to refresh the list
            onHabitDeleted();

        } catch (error) {
            console.error("Error deleting habit:", error);
            alert("Failed to delete habit. Please try again."); 
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* Trigger for the main action modal */}
            <Ellipsis onClick={() => setOpen(true)} className="cursor-pointer" />

            {/* Main Action Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
            <DialogOverlay className="bg-black/50 backdrop-blur-sm fixed inset-0 z-50" />
                <DialogContent className="flex flex-col items-center w-auto border-black border-[2px] rounded-radius z-50">
                    <DialogHeader>
                        <DialogTitle>{habit.title}</DialogTitle>
                    </DialogHeader>

                    {/* Back Button */}
                    <div className="flex glex-row gap-4 mt-4">
                            <BaseButton variant="icon" className="bg-primary" onClick={() => setOpen(false)}>
                                <ChevronsLeft className="w-10 h-10" strokeWidth={1.5} />
                            </BaseButton>

                        {/* Edit Button */}
                        <Link href={`/protected/habits/edit/${habit.id}`}>
                            <BaseButton variant="icon" className="bg-secondary">
                                <SquarePen className="w-10 h-10" strokeWidth={1.5} />
                            </BaseButton>
                        </Link>
                        
                        {/* Delete Button - triggers AlertDialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                {/* Button */}
                                <BaseButton variant="icon" className="bg-tertiary">
                                    <Trash2 className="w-10 h-10" strokeWidth={1.5} />
                                </BaseButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-sm mx-auto p-6"> 
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete tis habit? This action cannot be undone. 
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                        </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting} // Disable button while deleting
                                        className="text-black bg-tertiary"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
