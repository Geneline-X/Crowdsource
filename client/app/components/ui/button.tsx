import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-white text-black hover:bg-gray-100 shadow-sm",
      destructive: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40",
      outline: "border border-white/[0.1] bg-transparent text-white hover:bg-white/[0.05]",
      secondary: "bg-white/[0.05] text-white border border-white/[0.08] hover:bg-white/[0.08]",
      ghost: "text-gray-400 hover:bg-white/[0.05] hover:text-white",
      link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
      gradient: "bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    }
    
    const sizes = {
      default: "h-10 px-5 py-2",
      sm: "h-8 rounded-lg px-3 text-sm",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
