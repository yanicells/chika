import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import LoadingSpinner from "./loading-spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base disabled:opacity-50 disabled:cursor-not-allowed border-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border-primary",
        primary: "bg-blue text-white hover:bg-[#74a7f5] focus:ring-blue border-blue hover:border-[#74a7f5]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive border-destructive",
        danger: "bg-red text-white hover:bg-[#f17497] focus:ring-red border-red hover:border-[#f17497]",
        outline:
          "border-2 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground border-overlay0",
        secondary:
          "bg-surface0 text-text hover:bg-surface1 focus:ring-overlay0 border-overlay0 hover:border-subtext0",
        ghost:
          "bg-transparent text-subtext1 hover:bg-surface0 focus:ring-overlay0 border-transparent hover:border-overlay0",
        link: "text-primary underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "px-4 py-2 text-base",
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export default function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {children}
    </Comp>
  )
}

export { buttonVariants }
