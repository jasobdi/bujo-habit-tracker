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
                <DialogContent className=" flex flex-col border-black border-[2px] rounded-radius md:flex md:items-center z-50">
                    <DialogHeader>
                        <DialogTitle>{habit.title}</DialogTitle>
                    </DialogHeader>

                    {/* Back Button */}
                    <div className="flex glex-row gap-4 mt-4">
                            <BaseButton variant="icon" className="bg-primary" onClick={() => setOpen(false)}>
                                <ChevronsLeft className="w-10 h-10" />
                            </BaseButton>

                        {/* Edit Button */}
                        <Link href={`/protected/habits/edit/${habit.id}`}>
                            <BaseButton variant="icon" className="bg-secondary">
                                <SquarePen className="w-10 h-10" />
                            </BaseButton>
                        </Link>
                        
                        {/* Delete Button - triggers AlertDialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                {/* Button */}
                                <BaseButton variant="icon" className="bg-tertiary">
                                    <Trash2 className="w-10 h-10" />
                                </BaseButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="flex flex-col border-black border-[2px] rounded-radius z-[60]"> {/* Higher z-index than main modal */}
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        habit and remove its data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting} // Disable button while deleting
                                        className="text-error"
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
