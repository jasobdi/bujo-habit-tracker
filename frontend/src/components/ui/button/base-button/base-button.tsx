import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium text-center transition-colors disabled:bg-button-contrast disabled:pointer-events-none" +
  // for accessibility
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "aria-disabled:opacity-50 aria-disabled:pointer-events-none",
  {
    variants: {
      variant: {
        text: "h-9 px-3 py-1 text-lg rounded-radius-btn border-[2px] border-border font-sans font-normal my-5 bg-primary",
        start: "h-15 w-[265px] py-4 border-[2px] border-border rounded-radius-btn text-xl font-normal bg-secondary",
        icon: "h-15 w-15 p-4 border-[2px] border-border rounded-full text-foreground flex items-center justify-center",
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
      className={cn(buttonVariants({ variant}), className )}
    />
  )
}

export { BaseButton, buttonVariants }
