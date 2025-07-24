'use client';

import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { CategoryFormModal } from "@/components/modals/category-form-modal";
import { Plus, SquarePen, Trash2, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog/alert-dialog";

type Category = {
    id: number;
    title: string;
}

export default function ProfilePage() {
    const { data: session } = useSession();

    // states
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    useEffect(() => {
        async function fetchCategories() {
            if (!session?.accessToken) {
                console.warn("No access token available for fetching categories.");
                return;
            }

            try {
                const res = await fetch('http://localhost:8000/api/categories', {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        Accept: 'application/json',
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error('Failed to fetch categories:', res.status, text);
                    // Handle API-Fehler (z.B. User benachrichtigen)
                    return;
                }

                const data: Category[] = await res.json();
                setAvailableCategories(data); // Die geladenen Daten im State speichern
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        }

        fetchCategories();
    }, [session?.accessToken]);


    // toggle one category (select / unselect)
    const toggleCategory = (categoryId: number) => {
        if (selectedCategory?.id === categoryId) {
            setSelectedCategory(null); // unselect when already selected
        } else {
            const catToSelect = availableCategories.find(cat => cat.id === categoryId);
            if (catToSelect) {
                setSelectedCategory(catToSelect); // select
            }
        }
    };

    // handler to create or update a category
    const handleCategorySubmit = async (categoryData: { id?: number, title: string }) => {
        // API call
        try {
            const method = categoryData.id ? 'PATCH' : 'POST';
            const url = categoryData.id
                ? `http://localhost:8000/api/categories/${categoryData.id}`
                : `http://localhost:8000/api/categories`;

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session?.accessToken}`,
                    "Accept": "application/json"
                },
                body: JSON.stringify({ title: categoryData.title })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            const updatedOrNewCategory = await res.json();

            if (categoryData.id) {
                // update logic
                setAvailableCategories(prev => prev.map(cat =>
                    cat.id === updatedOrNewCategory.id ? updatedOrNewCategory : cat
                ));
            } else {
                // create logic
                setAvailableCategories(prev => [...prev, updatedOrNewCategory]);
            }
            setSelectedCategory(null); // reset selected category
            setIsEditModalOpen(false); // close modal
        } catch (error) {
            console.error("Fehler beim Speichern der Kategorie:", error);
            // Fehlerbehandlung für den Benutzer (z.B. Toast-Nachricht)
        }
    };

    // handler to delete a category
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            const res = await fetch(`http://localhost:8000/api/categories/${selectedCategory.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${session?.accessToken}`,
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            setAvailableCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
            setSelectedCategory(null); // reset selected category
            setIsDeleteAlertOpen(false); // close alert
        } catch (error) {
            console.error("Fehler beim Löschen der Kategorie:", error);
            // Fehlerbehandlung
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-auto w-full px-4 py-8">
            <div className="flex justify-center items-center w-20 h-20 rounded-full border-black border-[2px]">
            </div>
            <h2 className="mt-2 mb-4 font-semibold text-lg">Username</h2>
            <BaseButton
                type="button"
                variant="icon"
                className="bg-primary mb-4"
            >
                <Settings className="w-10 h-10" strokeWidth={1.5} ></Settings>
            </BaseButton>
            <div className="flex flex-col items-center justify-center w-[90%] md:w-[400px] border-black border-[2px] rounded-radius">
                <h3 className="font-semibold text-md mt-4 mb-2">Categories</h3>
                <p>Select a category to edit or delete.</p>

                <div className="flex flex-row gap-4 md:gap-8 my-4">

                    {/* create button */}
                    <CategoryFormModal initialData={null} onSubmit={handleCategorySubmit}>
                        <BaseButton
                            type="button"
                            className={selectedCategory ? 'bg-contrast' : 'bg-secondary'}
                            disabled={!!selectedCategory}
                            variant="icon">
                            <Plus className="w-10 h-10" strokeWidth={1.5} ></Plus>
                        </BaseButton>
                    </CategoryFormModal>

                    {/* update button */}
                    <BaseButton
                        type="button"
                        className={selectedCategory ? 'bg-secondary' : 'bg-contrast'}
                        disabled={!selectedCategory} // deactivated if no category selected
                        onClick={() => setIsEditModalOpen(true)}
                        variant="icon">
                        <SquarePen className="w-10 h-10" strokeWidth={1.5}></SquarePen>
                    </BaseButton>

                    {/* delete button */}
                    <BaseButton
                        type="button"
                        variant="icon"
                        className={selectedCategory ? 'bg-tertiary' : 'bg-contrast'}
                        disabled={!selectedCategory} // deactivate if no category selected
                        onClick={() => setIsDeleteAlertOpen(true)}
                    >
                        <Trash2 className="w-10 h-10" strokeWidth={1.5}></Trash2>
                    </BaseButton>

                </div>

                {/* category tags */}
                <div className="flex flex-wrap gap-2 my-2 justify-center">
                    {availableCategories.map((cat) => cat.id && cat.title ? (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className=
                            {`md:text-md border-[2px] border-black rounded-radius-btn px-2 py-1 
                            ${selectedCategory?.id === cat.id ? 'bg-tags' : 'bg-white'}`}
                        >
                            {cat.title}
                        </button>
                    ) : null
                    )}
                </div>

                {/* Modal for editing category */}
                {isEditModalOpen && selectedCategory && (
                    <CategoryFormModal
                        initialData={selectedCategory}
                        onSubmit={handleCategorySubmit}
                        onClose={() => setIsEditModalOpen(false)} // close modal
                        children={null} // is not used here, but required for the component
                    />
                )}


                {/* Alert-Dialog for delete */}
                {isDeleteAlertOpen && selectedCategory && (
                    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                        <AlertDialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-sm mx-auto p-6">
                            <AlertDialogHeader>

                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete the category "{selectedCategory?.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                    <BaseButton
                                        type="button"
                                        variant="text"
                                        className="bg-primary text-black"
                                        onClick={() => setIsDeleteAlertOpen(false)}
                                    >
                                        Cancel
                                    </BaseButton>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <BaseButton
                                        type="button"
                                        variant="text"
                                        className="bg-tertiary text-black"
                                        onClick={() => {
                                            handleDeleteCategory();
                                        }}
                                    >
                                        Delete
                                    </BaseButton>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

            </div>
        </div>

    );
}