'use client'

import { Category } from "../../types/category";

interface CategoryTagProps {
    category: Category;
}

export function CategoryTag({ category}: CategoryTagProps) {
    return (
        <div className="border-black border-[2px] rounded-radius-btn px-2 bg-tags">
            <span className="text-sm">
                {category.title}
            </span>
        </div>
    );
}