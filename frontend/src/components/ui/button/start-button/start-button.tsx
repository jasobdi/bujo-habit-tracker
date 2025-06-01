import * as React from "react";
import { BaseButton, buttonVariants } from "../base-button/base-button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface TextButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

export function StartButton({
    className,
    variant,
    children,
    ...props
}: TextButtonProps) {
    return (
        <BaseButton
            variant={variant}
            className={cn("h-[60px] w-[265px] py-[15px] border-[2px] border-black rounded-[10px] text-[24px] font-normal", className)}
            {...props}
        >
            {children}
        </BaseButton>
    );
}