import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-montserrat transition-all disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        text: "h-[35px] px-[5px] border-[2px] border-black rounded-[10px] text-[20px] font-normal",
        start: "h-[60px] w-[265px] py-[15px] border-[2px] border-black rounded-[10px] text-[24px] font-normal",
        icon: "h-[60px] w-[60px] border-[2px] border-black rounded-full text-black",
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
