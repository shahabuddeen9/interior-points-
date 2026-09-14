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
      primary: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-black/90 active:scale-[0.99] shadow-sm",
      secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--border)] border border-[var(--border)]",
      outline: "border border-[var(--border)] bg-transparent hover:border-[var(--primary)] text-[var(--foreground)]",
      ghost: "bg-transparent hover:bg-black/5 text-[var(--foreground)]",
      gold: "bg-[var(--accent)] text-[var(--accent-foreground)] hover:brightness-105 active:scale-[0.99] shadow-sm font-semibold",
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
