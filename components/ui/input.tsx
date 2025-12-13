import * as React from "react"

import { cn } from "@/lib/utils"

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: "0.5rem",
  border: "1px solid #d0d5dd",
  backgroundColor: "#fff",
  padding: "0.55rem 0.85rem",
  fontSize: "0.95rem",
  color: "#0f172a",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        style={{ ...baseInputStyle, ...style }}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
