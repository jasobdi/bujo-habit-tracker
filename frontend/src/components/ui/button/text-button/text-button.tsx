import * as React from "react";
import { BaseButton, buttonVariants } from "../base-button/base-button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface TextButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    children: React.ReactNode;
}

export function TextButton({
    className,
    variant,
    children,
    ...props
}: TextButtonProps) {
    return (
        <BaseButton
            variant={variant}
            className={cn("h-[35px] px-[12px] py-[5px] text-[20px] font-normal rounded-[10px] border-2 border-black font-montserrat", className)}
            {...props}
        >
            {children}
        </BaseButton>
    );
}