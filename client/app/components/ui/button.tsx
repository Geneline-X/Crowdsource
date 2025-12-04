import * as React from "react"

import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl",
      destructive: "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:from-red-600 hover:to-pink-700",
      outline: "border border-slate-600 bg-transparent text-slate-200 hover:bg-slate-700/50 hover:text-white",
      secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600",
      ghost: "text-slate-300 hover:bg-slate-700/50 hover:text-white",
      link: "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
    }
    
    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 rounded-lg px-4 text-sm",
      lg: "h-12 rounded-xl px-10 text-base",
      icon: "h-11 w-11",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-slate-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
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
