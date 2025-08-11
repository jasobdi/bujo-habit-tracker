'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { BaseButton } from "@/components/ui/button/base-button/base-button";
import { CategoryFormModal } from "@/components/modals/category-form-modal";
import { LogoutButton } from "@/components/logout-button/logout-button";
import { ProfileEditForm } from "@/components/forms/update-user/profile-edit-form";
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

    /** ---------- State ---------- */
    /** CATEGORIES */
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [occupied, setOccupied] = useState(false); // check if category is assigned to habits
    const [usageLoading, setUsageLoading] = useState(false);

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
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch categories:", res.status, text);
                return;
            }

            const data: Category[] = await res.json();
            setAvailableCategories(data);
        } catch (err) {
            console.error("Error loading categories:", err);
        }
    }

    /** USER */
    async function fetchUserData() {
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const res = await fetch(`http://localhost:8000/api/users/${session.user?.id}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Failed to fetch user data:", res.status, text);
                setIsLoading(false);
                return;
            }

            const data: UserData = await res.json();
            setUserData(data);
        } catch (err) {
            console.error("Error loading user data:", err);
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

            // Fallback: wenn ein string "true"/"false" o.ä. kommt
            if (isOccupied === undefined && typeof in_use === "string") {
                isOccupied = in_use.toLowerCase() === "true";
            }

            setOccupied(!!isOccupied);
            console.debug("[usage]", { categoryId, data, parsed: !!isOccupied });
        } catch (err) {
            console.error("Error checking category usage:", err);
            setOccupied(false);
        } finally {
            setUsageLoading(false);
        }
    }

    /** ---------- Mutations ---------- */
    /** CATEGORIES */
    const handleCategorySubmit = async (categoryData: { id?: number; title: string }) => {
        try {
            const method = categoryData.id ? "PATCH" : "POST";
            const url = categoryData.id
                ? `http://localhost:8000/api/categories/${categoryData.id}`
                : `http://localhost:8000/api/categories`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.accessToken}`,
                    Accept: "application/json",
                },
                body: JSON.stringify({ title: categoryData.title }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            await fetchCategories();
            setSelectedCategory(null);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Fehler beim Speichern der Kategorie:", error);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory || !token) return;

        try {
            const res = await fetch(`http://localhost:8000/api/categories/${selectedCategory.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${session?.accessToken}` },
                cache: "no-store",
            });

            if (!res.ok) {
                // 409 = in use -> check usage
                if (res.status === 409) {
                    await checkCategoryUsage(selectedCategory.id);
                    return;
                }
                const errorText = await res.text();
                console.error("Delete failed:", res.status, errorText);
                return;
            }

            // Successfully deleted
            await fetchCategories();
            setSelectedCategory(null);
            setIsDeleteAlertOpen(false);
        } catch (error) {
            console.error("Fehler beim Löschen der Kategorie:", error);
        }
    };

    /** USER */
    const handleUpdateSuccess = () => {
        fetchUserData();
        console.log("Profile updated successfully!");
    };

    const handleDeleteAccount = async () => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:8000/api/user`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            await signOut({ callbackUrl: "/public/register" });
        } catch (error) {
            console.error("Error while deleting account:", error);
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
    // when the selected category  or the access token changes
    useEffect(() => {
        if (!selectedCategory) {
            setOccupied(false);
            return;
        }
        checkCategoryUsage(selectedCategory.id);
    }, [selectedCategory, token]);

    /** ---------- Early returns ---------- */
    if (status === "loading") return <div>Loading...</div>;
    if (status === "unauthenticated") return <div>Please log in.</div>;

    /** ---------- Handlers ---------- */
    const toggleCategory = (categoryId: number) => {
        if (selectedCategory?.id === categoryId) {
            setSelectedCategory(null);
            setOccupied(false);
        } else {
            const catToSelect = availableCategories.find((cat) => cat.id === categoryId);
            if (catToSelect) {
                setSelectedCategory(catToSelect);
                checkCategoryUsage(catToSelect.id);
            }
        }
    };

    /** ---------- Render ---------- */
    return (
        <div className="flex flex-col items-center justify-center h-auto w-full px-4 py-8">
            {/* AVATAR */}
            <div className="flex justify-center items-center w-20 h-20 rounded-full border-black border-[2px]">
                <Image
                    src="/images/profile_pic.png"
                    alt="profile picture"
                    width={80}
                    height={80}
                    className="rounded-full"
                />
            </div>
            <h2 className="mt-2 mb-4 font-semibold text-lg">
                Hello {session?.user?.username || "Hello!"}
            </h2>

            {/* CATEGORIES */}
            <div className="flex flex-col items-center justify-center w-[90%] md:w-[400px] border-black border-[2px] rounded-radius">
                <h3 className="font-semibold text-md mt-4 mb-2">Categories</h3>
                <p>Select a category to edit or delete.</p>

                <div className="flex flex-row gap-4 md:gap-8 my-4">
                    {/* create button */}
                    <CategoryFormModal initialData={null} onSubmit={handleCategorySubmit}>
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
                        disabled={!selectedCategory || occupied}
                        onClick={() => {
                            if (!occupied) setIsDeleteAlertOpen(true);
                        }}
                    >
                        <Trash2 className="w-10 h-10" strokeWidth={1.5} />
                    </BaseButton>
                </div>

                {selectedCategory && occupied && (
                    <p className="mt-2 text-center">
                        This category is assigned to one or more habits and cannot be deleted.
                    </p>
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
                {isEditModalOpen && selectedCategory && (
                    <CategoryFormModal
                        initialData={selectedCategory}
                        onSubmit={handleCategorySubmit}
                        onClose={() => setIsEditModalOpen(false)}
                        children={null}
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
                    <ProfileEditForm initialData={userData} onUpdateSuccess={handleUpdateSuccess} />
                ) : (
                    <p>Failed to load user data.</p>
                )}

                {/* Alert for deleting account */}
                <AlertDialog open={isDeleteAccountAlertOpen} onOpenChange={setIsDeleteAccountAlertOpen}>
                    <AlertDialogTrigger asChild>
                        <button
                            className="underline text-md"
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