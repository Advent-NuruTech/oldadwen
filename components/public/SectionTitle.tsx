"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  link?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  link,
}) => {
  return (
    <div className="text-center max-w-4xl mx-auto mb-14 px-4">

      {/* Accent Line */}
      <div className="w-20 h-1.5 mx-auto mb-6 
        bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-700 
        rounded-full shadow-sm" 
      />

      {/* Title */}
      <h2 className="
        text-4xl sm:text-5xl lg:text-6xl
        font-black tracking-tight leading-tight
        text-gray-900 
        dark:text-white
      ">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="
          mt-5 
          text-gray-700 
          dark:text-gray-200
          text-lg sm:text-xl
          leading-relaxed
        ">
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
              text-blue-700 
              dark:text-cyan-300
              text-base sm:text-lg
              font-bold tracking-wide
              hover:underline
              transition-all duration-200
            "
          >
            VISIT CHANNEL →
          </a>
        </div>
      )}
    </div>
  );
};