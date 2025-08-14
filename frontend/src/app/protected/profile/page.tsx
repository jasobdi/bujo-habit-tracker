'use client';

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { CategoryFormModal } from "@/components/modals/category-form-modal";
import { LogoutButton } from "@/components/logout-button/logout-button";
import { ProfileEditForm } from "@/components/forms/update-user/profile-edit-form";
import { appToast } from "@/components/feedback/app-toast";
import { InlineNotice } from "@/components/feedback/inline-notice";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog/alert-dialog";

type Category = {
    id: number;
    title: string;
};

type UserData = {
    username: string;
    email: string;
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const token = session?.accessToken; // string | undefined
    const { successToast, errorToast } = appToast();

    /** ---------- State ---------- */
    /** CATEGORIES */
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [occupied, setOccupied] = useState(false); // check if category is assigned to habits
    const [usageLoading, setUsageLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [usageCount, setUsageCount] = useState<number | null>(null);
    const [noticeDismissed, setNoticeDismissed] = useState(false);

    /** USER */
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteAccountAlertOpen, setIsDeleteAccountAlertOpen] = useState(false);

    /** ---------- Data-Fetcher ---------- */
    /** CATEGORIES */
    async function fetchCategories() {
        if (!token) return;
        try {
            const res = await fetch("http://localhost:8000/api/categories", {
                headers: {
                    Authorization: `Bearer ${session!.accessToken}`,
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch categories:", res.status, text);
                errorToast("Failed to load categories");
                return;
            }

            const data: Category[] = await res.json();
            setAvailableCategories(data);
        } catch (err) {
            console.error("Error loading categories:", err);
            errorToast("Failed to load categories");
        }
    }

    /** USER */
    async function fetchUserData() {
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`http://localhost:8000/api/users/${session!.user?.id}`, {
                headers: {
                    Authorization: `Bearer ${session!.accessToken}`,
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch user data:", res.status, text);
                errorToast("Failed to load user data");
                setIsLoading(false);
                return;
            }

            const data: UserData = await res.json();
            setUserData(data);
        } catch (err) {
            console.error("Error loading user data:", err);
            errorToast("Failed to load user data");
        } finally {
            setIsLoading(false);
        }
    }

    /** Check if a category is assigned to habits */
    async function checkCategoryUsage(categoryId: number) {
        if (!token) return;
        try {
            setUsageLoading(true);
            const res = await fetch(`http://localhost:8000/api/categories/${categoryId}/usage`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
                cache: "no-store",
            });
            if (!res.ok) throw new Error(`Failed to check usage: ${res.status}`);
            const data = await res.json();

            const {
                in_use,
                inUse,
                occupied: occ,
                assigned,
                in_use_count,
                inUseCount,
                count,
            } = (data ?? {}) as Record<string, unknown>;

            let isOccupied: boolean | undefined =
                typeof in_use === "boolean" ? in_use :
                    typeof inUse === "boolean" ? inUse :
                        typeof occ === "boolean" ? occ :
                            typeof assigned === "boolean" ? assigned :
                                typeof in_use_count === "number" ? in_use_count > 0 :
                                    typeof inUseCount === "number" ? inUseCount > 0 :
                                        typeof count === "number" ? count > 0 :
                                            typeof data === "boolean" ? data :
                                                typeof data === "number" ? data > 0 :
                                                    typeof (data as any)?.message === "string" ? undefined :
                                                        undefined;

            let numericCount: number | null =
                typeof in_use_count === "number" ? in_use_count :
                    typeof inUseCount === "number" ? inUseCount :
                        typeof count === "number" ? count :
                            // fallback: if only boolean available, map true->1, false->0
                            (typeof isOccupied === "boolean" ? (isOccupied ? 1 : 0) : null);

            setOccupied(!!isOccupied);
            setUsageCount(numericCount);

            console.debug("[usage]", { categoryId, data, occupied: !!isOccupied, count: numericCount });

            return { occupied: !!isOccupied, count: numericCount ?? 0 };
        } catch (err) {
            console.error("Error checking category usage:", err);
            setOccupied(false);
            setUsageCount(null);
            return { occupied: false, count: 0 };
        } finally {
            setUsageLoading(false);
        }
    }

    /** ---------- Mutations ---------- */
    /** CATEGORIES */
    type Category = { id: number; title: string };

    // Submit CREATE (new)
    async function submitCreateCategory({ title }: { title: string }): Promise<Category> {
        if (!session?.accessToken) {
            errorToast("Not authenticated", "Please log in and try again.");
            throw new Error("Missing token");
        }

        try {
            const res = await fetch("http://localhost:8000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (!res.ok) {
                const errText = await res.text();
                errorToast("Failed to create category");
                throw new Error(errText || "Failed to create category");
            }

            const json = await res.json();
            const newCat: Category = json.category ?? { id: json.id, title: json.title };

            // local state updates
            setAvailableCategories((prev) => [...prev, newCat]);
            setSelectedCategory(newCat);

            successToast("Category created");
            return newCat;
        } catch (err) {
            console.error("Create category error:", err);
            errorToast("Failed to create category");
            throw err;
        }
    }

    // Submit UPDATE (edit)
    async function submitUpdateCategory({ title }: { title: string }): Promise<Category> {
        if (!session?.accessToken) {
            errorToast("Not authenticated", "Please log in and try again.");
            throw new Error("Missing token");
        }
        if (!selectedCategory) {
            errorToast("No category selected");
            throw new Error("No category selected");
        }

        try {
            const res = await fetch(`http://localhost:8000/api/categories/${selectedCategory.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (!res.ok) {
                const errText = await res.text();
                errorToast("Failed to update category");
                throw new Error(errText || "Failed to update category");
            }

            const json = await res.json();
            const updated: Category = json.category ?? { id: selectedCategory.id, title };

            // local state updates
            setAvailableCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setSelectedCategory(updated);

            successToast("Category updated");
            return updated;
        } catch (err) {
            console.error("Update category error:", err);
            errorToast("Failed to update category");
            throw err;
        }
    }

    const handleDeleteCategory = async () => {
        if (!selectedCategory || !token) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`http://localhost:8000/api/categories/${selectedCategory.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session!.accessToken}` },
                cache: "no-store",
            });

            if (res.status === 409) {
                // Inline notice for "category in use"
                await checkCategoryUsage(selectedCategory.id);
                return;
            }

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || `Delete failed: ${res.status}`);
            }

            await fetchCategories();
            setSelectedCategory(null);
            setIsDeleteAlertOpen(false);
            successToast("Category deleted");
        } catch (error) {
            console.error("Delete failed:", error);
            errorToast("Failed to delete category");
        } finally {
            setIsDeleting(false);
        }
    };
    /** USER */
    const handleUpdateSuccess = () => {
        fetchUserData();
        successToast("Profile updated");
    };

    const handleDeleteAccount = async () => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:8000/api/user`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session!.accessToken}` },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Failed to delete account");
            }

            successToast("Account deleted");
            await signOut({ callbackUrl: "/public/register" });
        } catch (error) {
            console.error("Error while deleting account:", error);
            errorToast("Failed to delete account");
        } finally {
            setIsDeleteAccountAlertOpen(false);
        }
    };

    /** ---------- useEffects (must stand before early returns) ---------- */
    // load categories & user date, as soon as authenticated or token is available
    useEffect(() => {
        if (status !== "authenticated" || !token) {
            setIsLoading(false);
            return;
        }
        fetchCategories();
        fetchUserData();
    }, [status, token]);

    // automatically check if the selected category is occupied
    // when the selected category or the access token changes
    useEffect(() => {
        if (!selectedCategory) {
            setOccupied(false);
            return;
        }
        checkCategoryUsage(selectedCategory.id);
    }, [selectedCategory, token]);

    // Reset dismissed flag when category changes
    useEffect(() => {
        // show the notice again when user selects another category
        setNoticeDismissed(false);
    }, [selectedCategory?.id]);

    /** ---------- Early returns ---------- */
    if (status === "loading") return <div>Loading...</div>;
    if (status === "unauthenticated") return <div>Please log in.</div>;

    /** ---------- Handlers ---------- */
    const toggleCategory = (categoryId: number) => {
        if (selectedCategory?.id === categoryId) {
            setSelectedCategory(null);
            setOccupied(false);
            setUsageCount(null);
            setNoticeDismissed(false);
        } else {
            const catToSelect = availableCategories.find((cat) => cat.id === categoryId);
            if (catToSelect) {
                setSelectedCategory(catToSelect);
                setNoticeDismissed(false);
                checkCategoryUsage(catToSelect.id);
            }
        }
    };

    /** ---------- Render ---------- */
    return (
        <div className="flex flex-col items-center justify-center h-auto w-full px-4 py-8">

            {/* CATEGORIES */}
            <div className="flex flex-col items-center justify-center w-[90%] md:w-[400px] border-black border-[2px] rounded-radius">
                <h3 className="font-semibold text-md mt-4 mb-2">Categories</h3>
                <p>Select a category to edit or delete.</p>

                <div className="flex flex-row gap-4 md:gap-8 my-4">
                    {/* create button */}
                    <CategoryFormModal initialData={null} onSubmit={submitCreateCategory}>
                        <BaseButton
                            type="button"
                            className={selectedCategory ? "bg-contrast" : "bg-secondary"}
                            disabled={!!selectedCategory}
                            variant="icon"
                        >
                            <Plus className="w-10 h-10" strokeWidth={1.5} />
                        </BaseButton>
                    </CategoryFormModal>

                    {/* update button */}
                    <BaseButton
                        type="button"
                        className={selectedCategory ? "bg-secondary" : "bg-contrast"}
                        disabled={!selectedCategory}
                        onClick={() => setIsEditModalOpen(true)}
                        variant="icon"
                    >
                        <SquarePen className="w-10 h-10" strokeWidth={1.5} />
                    </BaseButton>

                    {/* delete button */}
                    <BaseButton
                        type="button"
                        variant="icon"
                        className={selectedCategory && !occupied ? "bg-tertiary" : "bg-contrast"}
                        disabled={!selectedCategory || occupied || isDeleting}
                        onClick={() => {
                            if (!occupied) setIsDeleteAlertOpen(true);
                        }}
                        aria-busy={isDeleting}
                    >
                        <Trash2 className="w-10 h-10" strokeWidth={1.5} />
                    </BaseButton>
                </div>

                {/* Inline notice for "category in use" */}
                {selectedCategory && occupied && !noticeDismissed && (
                    <InlineNotice
                        key={selectedCategory.id}
                        variant="info"
                        className="mt-2 mb-4 md:w-[80%] w-[120%]"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-sm">
                                <strong>Category is in use.</strong><br />{" "}
                                {usageCount != null
                                    ? `${usageCount} habits ${usageCount === 1 ? '' : 's'} currently use this category. Unassign it first, to enable deletion.`
                                    : `This category is currently used by one or more habits. Unassign it first, to enable deletion.`}
                            </span>

                        </div>
                    </InlineNotice>
                )}

                {/* category tags */}
                <div className="flex flex-wrap gap-2 my-2 justify-center">
                    {availableCategories.map((cat) =>
                        cat.id && cat.title ? (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => toggleCategory(cat.id)}
                                className={`md:text-md border-[2px] border-black rounded-radius-btn px-2 py-1 ${selectedCategory?.id === cat.id ? "bg-tags" : "bg-white"
                                    }`}
                            >
                                {cat.title}
                            </button>
                        ) : null
                    )}
                </div>

                {/* Modal for editing a category */}
                {selectedCategory && (
                    <CategoryFormModal
                        initialData={selectedCategory}
                        onSubmit={submitUpdateCategory}
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                    />
                )}

                {/* Alert for deleting category */}
                {isDeleteAlertOpen && selectedCategory && (
                    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                        <AlertDialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-sm mx-auto p-6">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete the category "{selectedCategory?.title}"?
                                    This action cannot be undone.
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
                                        onClick={handleDeleteCategory}
                                        disabled={isDeleting}
                                        aria-busy={isDeleting}
                                    >
                                        Delete
                                    </BaseButton>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {/* SETTINGS */}
            <div className="flex flex-col items-center justify-center w-[90%] md:w-[400px] border-black border-[2px] rounded-radius mt-8">
                <h3 className="font-semibold text-md mt-4 mb-2">Settings</h3>

                {isLoading ? (
                    <p>Loading user data...</p>
                ) : userData ? (
                    <ProfileEditForm
                        initialData={userData}
                        onUpdateSuccess={handleUpdateSuccess}
                        onInvalid={() => errorToast("Form is incomplete")} />
                ) : (
                    <p>Failed to load user data.</p>
                )}

                {/* Alert for deleting account */}
                <AlertDialog open={isDeleteAccountAlertOpen} onOpenChange={setIsDeleteAccountAlertOpen}>
                    <AlertDialogTrigger asChild>
                        <button
                            className="underline text-md mb-8"
                            onClick={() => setIsDeleteAccountAlertOpen(true)}
                        >
                            Delete Account
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-[2px] border-black rounded-radius backdrop-blur-sm max-w-sm mx-auto p-6">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Account</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete your account? This action is permanent and
                                cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <BaseButton
                                    type="button"
                                    variant="text"
                                    className="bg-primary text-black"
                                    onClick={() => setIsDeleteAccountAlertOpen(false)}
                                >
                                    Cancel
                                </BaseButton>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <BaseButton type="button" variant="text" className="bg-tertiary text-black" onClick={handleDeleteAccount}>
                                    Delete
                                </BaseButton>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* LOGOUT BUTTON */}
            <div className="flex justify-center mt-8">
                <LogoutButton />
            </div>
        </div>
    );
}