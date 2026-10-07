import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius)]";
    
    const variants = {
      primary: "bg-[#151413] text-[#fdfbf7] hover:bg-neutral-800 active:scale-[0.99] shadow-xs",
      secondary: "bg-[#f4eee3] text-[#151413] hover:bg-[#eae3d5] border border-[#e6dfd2]",
      outline: "border border-[#e6dfd2] bg-white hover:border-[#151413] text-[#151413] hover:bg-[#fdfbf7]",
      ghost: "bg-transparent hover:bg-black/5 text-[#151413]",
      gold: "bg-gradient-to-r from-[#d9aa4c] via-[#c59b4c] to-[#a87f32] text-[#151413] hover:from-[#e3b65a] hover:via-[#d4aa55] hover:to-[#b68c3b] active:scale-[0.99] shadow-sm font-bold",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs uppercase tracking-wider",
      md: "px-5 py-2.5 text-sm uppercase tracking-wider",
      lg: "px-7 py-3.5 text-base uppercase tracking-wider",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
