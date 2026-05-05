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
    <div className="text-center max-w-4xl mx-auto mb-16 px-4">

      {/* Accent Line */}
      <div className="w-20 h-1.5 mx-auto mb-6 
        bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#2563EB] 
        rounded-full"
      />

      {/* Title */}
      <h2 className={`
        text-4xl sm:text-5xl lg:text-6xl
        font-extrabold tracking-tight leading-tight
        ${isDark ? "text-white" : "text-gray-900"}
      `}>
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className={`
          mt-5 
          text-lg sm:text-xl
          leading-relaxed
          max-w-2xl mx-auto
          ${isDark ? "text-gray-300" : "text-gray-600"}
        `}>
          {subtitle}
        </p>
      )}

      {/* Optional Link */}
      {link && (
        <div className="mt-8">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-block
              text-[#2563EB]
              text-base sm:text-lg
              font-semibold
              hover:underline
              transition
            "
          >
            Visit Channel →
          </a>
        </div>
      )}
    </div>
  );
};