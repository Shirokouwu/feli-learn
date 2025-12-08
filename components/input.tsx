import { cn } from "@/lib/utils"
import { forwardRef } from "react"

const Input = forwardRef<HTMLInputElement, any>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Label = forwardRef<HTMLLabelElement, any>(({ className, children, ...props }, ref) => {
  return (
    <label ref={ref} className={cn("block text-sm font-medium leading-tight", className)} {...props}>
      {children}
    </label>
  )
})
Label.displayName = "Label"

export { Input, Label }
