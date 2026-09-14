import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "default" | "gold" | "secondary" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[var(--primary)] text-[var(--primary-foreground)]",
    gold: "bg-[oklch(0.74_0.09_75/0.18)] text-[#8c651e] border border-[oklch(0.74_0.09_75/0.4)] font-medium",
    secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] border border-[var(--border)]",
    outline: "border border-[var(--border)] text-[var(--muted-foreground)] bg-transparent",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
