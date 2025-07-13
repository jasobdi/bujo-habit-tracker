'use client'

import { Category } from "../../types/category";

interface CategoryTagProps {
    category: Category;
}

export function CategoryTag({ category}: CategoryTagProps) {
    return (
        <div className="border-black border-[2px] border-radius-btn bg-tags">
            <span className="text-sm">
                {category.title}
            </span>
        </div>
    );
}