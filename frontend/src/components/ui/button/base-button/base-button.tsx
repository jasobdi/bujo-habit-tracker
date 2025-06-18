import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium text-center transition-colors disabled:bg-button-inactive disabled:pointer-events-none [&>svg]:w-6 [&>svg]:h-6 " +
  // for accessibility
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
  {
    variants: {
      variant: {
        text: "h-[35px] px-5 border-[2px] border-[var(--border)] rounded-[var(--radius)] text-lg font-normal bg-[var(--primary)] text-[var(--foreground)]",
        start: "h-[60px] w-[265px] py-[15px] border-[2px] border-[var(--border)] rounded-[var(--radius)] text-xl font-normal bg-[var(--secondary)] text-[var(--foreground)]",
        icon: "h-[60px] w-[60px] p-4 border-[2px] border-[var(--border)] rounded-full bg-[var(--primary)] text-[var(--foreground)] flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
)


type BaseButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function BaseButton({ className, variant, asChild = false, ...props }: BaseButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
    {...props}
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
    />
  )
}

export { BaseButton, buttonVariants }
