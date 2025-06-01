import * as React from "react";
import { BaseButton, buttonVariants } from "../base-button/base-button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface TextButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

export function IconButton({
    className,
    variant,
    children,
    ...props
}: TextButtonProps) {
    return (
        <BaseButton
            variant={variant}
            className={cn("h-[60px] w-[60px] border-[2px] border-black rounded-full text-black", className)}
            {...props}
        >
            {children}
        </BaseButton>
    );
}