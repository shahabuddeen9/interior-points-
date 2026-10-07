import React from "react";
import { Link } from "../lib/router";

interface BrandLogoProps {
  className?: string;
  variant?: "default" | "dark" | "inverted";
  size?: "sm" | "md" | "lg";
  href?: string;
  showTagline?: boolean;
}

export function BrandLogo({
  className = "",
  variant = "default",
  size = "md",
  href = "/",
  showTagline = true,
}: BrandLogoProps) {
  const isDark = variant === "dark" || variant === "inverted";

  const sizeStyles = {
    sm: {
      svgH: 32,
      svgW: 36,
      titleText: "text-lg",
      subtitleText: "text-[11px]",
      taglineText: "text-[9px]",
      dividerH: "h-6",
    },
    md: {
      svgH: 38,
      svgW: 42,
      titleText: "text-xl sm:text-2xl",
      subtitleText: "text-xs sm:text-sm",
      taglineText: "text-[10px]",
      dividerH: "h-8",
    },
    lg: {
      svgH: 48,
      svgW: 52,
      titleText: "text-2xl sm:text-3xl",
      subtitleText: "text-sm sm:text-base",
      taglineText: "text-xs",
      dividerH: "h-10",
    },
  }[size];

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic "iP" Monogram Icon matching official branding */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={sizeStyles.svgW}
          height={sizeStyles.svgH}
          viewBox="0 0 46 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform group-hover:scale-105"
        >
          {/* Letter 'i' golden square dot */}
          <rect
            x="3"
            y="5"
            width="6.5"
            height="6.5"
            rx="1.2"
            fill="#c59b4c"
          />

          {/* Letter 'i' main stem */}
          <rect
            x="3"
            y="15"
            width="6.5"
            height="24"
            rx="1.5"
            fill={isDark ? "#fdfbf7" : "#151413"}
          />

          {/* Letter 'P' main stem */}
          <rect
            x="14"
            y="5"
            width="6.5"
            height="34"
            rx="1.5"
            fill={isDark ? "#fdfbf7" : "#151413"}
          />

          {/* Letter 'P' curved bowl */}
          <path
            d="M17 5H30C36.6 5 42 10.4 42 17C42 23.6 36.6 29 30 29H17V5Z"
            fill={isDark ? "#fdfbf7" : "#151413"}
          />

          {/* Counter space inside P bowl (cutout effect) */}
          <path
            d="M20.5 9.5H29.5C33.6 9.5 37 12.9 37 17C37 21.1 33.6 24.5 29.5 24.5H20.5V9.5Z"
            fill={isDark ? "#151413" : "#fdfbf7"}
          />

          {/* Architectural House / Roof outline nested inside P bowl */}
          <path
            d="M24 18.5L29 13.5L34 18.5"
            stroke="#c59b4c"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M25.5 18V22H32.5V18"
            stroke="#c59b4c"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* House door / window detail */}
          <rect
            x="27.5"
            y="19"
            width="3"
            height="3"
            rx="0.5"
            fill="#c59b4c"
          />
        </svg>
      </div>

      {/* Vertical separator bar */}
      <div
        className={`${sizeStyles.dividerH} w-[1.5px] bg-[#c59b4c]/70 shrink-0`}
      />

      {/* Stacked Wordmark: Interior / Points */}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-baseline space-x-1">
          <span
            className={`font-display font-bold tracking-tight leading-none ${sizeStyles.titleText} ${
              isDark
                ? "text-white"
                : "text-[#151413] group-hover:text-[#8a6218] transition-colors"
            }`}
          >
            Interior
          </span>
          <span
            className={`font-body font-semibold tracking-normal leading-none ${sizeStyles.subtitleText} text-[#c59b4c]`}
          >
            Points
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-body uppercase tracking-widest leading-none mt-1 hidden sm:block ${
              sizeStyles.taglineText
            } ${isDark ? "text-neutral-400" : "text-[#787368]"}`}
          >
            Designing Spaces. Creating Experiences.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
