"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  link?: string;
  variant?: "light" | "dark";
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  link,
  variant = "light",
}) => {
  const isDark = variant === "dark";

  return (
    <section
      className="relative overflow-hidden rounded-[2rem] mb-16"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

      {/* Decorative Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-20 md:py-28">
        
        {/* Accent Line */}
        <div
          className="
            w-24 h-1.5 mx-auto mb-7
            bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400
            rounded-full
          "
        />

        {/* Title */}
        <h2
          className={`
            text-4xl sm:text-5xl lg:text-6xl
            font-black tracking-tight leading-tight
            drop-shadow-2xl
            ${isDark ? "text-white" : "text-white"}
          `}
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={`
              mt-6
              text-lg sm:text-xl md:text-2xl
              leading-relaxed
              max-w-3xl mx-auto
              font-medium
              ${isDark ? "text-slate-200" : "text-slate-200"}
            `}
          >
            {subtitle}
          </p>
        )}

        {/* Optional Link */}
        {link && (
          <div className="mt-10">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2
                bg-cyan-400 hover:bg-cyan-300
                text-black
                px-7 py-3
                rounded-full
                text-base sm:text-lg
                font-bold
                shadow-xl
                transition-all duration-300
                hover:scale-105
              "
            >
              Visit Channel →
            </a>
          </div>
        )}
      </div>
    </section>
  );
};