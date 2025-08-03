import * as React from "react";
import { BaseButton } from "../base-button/base-button";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ComponentProps<"button"> {
    icon: React.ReactNode;
    "aria-label": string;
    bgColor?: string;
}

export function IconButton({
    className,
    icon,
    bgColor = "bg-[var(primary)]",
    ...props
}: IconButtonProps) {
    return (
        <BaseButton
            variant="icon"
            className={cn(bgColor, className)}
            {...props}
        >
            {icon}
        </BaseButton>
    );}