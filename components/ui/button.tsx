import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const baseButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  borderRadius: "0.5rem",
  fontWeight: 600,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "transparent",
  cursor: "pointer",
  transition: "all 0.2s ease",
  textTransform: "none",
}

const sizeFallbacks: Record<
  NonNullable<ButtonProps["size"]>,
  React.CSSProperties
> = {
  default: { height: 40, padding: "0 1rem", fontSize: "0.95rem" },
  sm: { height: 36, padding: "0 0.85rem", borderRadius: "0.4rem", fontSize: "0.85rem" },
  lg: { height: 44, padding: "0 1.5rem", fontSize: "1rem" },
  icon: { height: 40, width: 40, padding: 0 },
}

const variantFallbacks: Record<
  NonNullable<ButtonProps["variant"]>,
  React.CSSProperties
> = {
  default: { backgroundColor: "#1d4ed8", color: "#fff" },
  destructive: { backgroundColor: "#dc2626", color: "#fff" },
  outline: {
    backgroundColor: "#fff",
    color: "#0f172a",
    borderColor: "#d0d5dd",
  },
  secondary: { backgroundColor: "#e2e8f0", color: "#0f172a" },
  ghost: { backgroundColor: "transparent", color: "#0f172a" },
  link: {
    backgroundColor: "transparent",
    color: "#1d4ed8",
    borderColor: "transparent",
    textDecoration: "underline",
  },
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", style, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const fallbackStyle: React.CSSProperties = {
      ...baseButtonStyle,
      ...sizeFallbacks[size],
      ...variantFallbacks[variant],
      ...style,
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={fallbackStyle}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
