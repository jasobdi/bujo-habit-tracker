'use client';

import { Category } from "../../types/category";

/**
 * CategoryTag component displays a tag for a given category.
 */

interface CategoryTagProps {
    category: Category;
}

export function CategoryTag({ category}: CategoryTagProps) {
    return (
        <div className="border-black border-[2px] rounded-radius-btn px-2 py-1 bg-tags">
            <span className="text-sm">
                {category.title}
            </span>
        </div>
    );
}