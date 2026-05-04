"use client";

import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
  metadata: string;
}

interface MemberCardProps {
  member: Member;
}

// Strip HTML safely
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// 60–70 word professional preview (matches blog feel)
function getPreview(html: string, limit = 70) {
  const clean = stripHtml(html);
  const words = clean.split(" ");
  return words.length > limit
    ? words.slice(0, limit).join(" ") + "…"
    : clean;
}

export default function MemberCard({ member }: MemberCardProps) {
  const previewText = getPreview(member.metadata);

  return (
    <div className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-[#1E293B]/40 border border-[#334155] backdrop-blur-sm h-full flex flex-col">
      
      {/* Image - full width, no cropping, matching blog card image style */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E27] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        {member.imageUrl ? (
          <>
            <Image
              src={member.imageUrl}
              alt={member.name}
              width={800}
              height={600}
              className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700 p-4"
            />
            <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#0A0E27]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <svg className="w-5 h-5 text-[#60A5FA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0A0E27]/50 text-gray-500 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Content area - matching blog card text styling */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Decorative accent line - matches blog card */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] mb-4 rounded-full"></div>
        
        {/* Name */}
        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-[#60A5FA] transition-colors">
          {member.name}
        </h3>

        {/* Description */}
        <div className="text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">
          {parse(previewText)}
        </div>

        {/* View Profile CTA - matching blog card Read Article button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] flex items-center justify-center">
              <span className="text-xs font-bold text-white">{member.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-xs text-gray-500">Team Member</span>
          </div>
          <Link
            href={`/members/${member.id}`}
            className="text-sm font-medium text-[#60A5FA] group-hover:text-[#93C5FD] group-hover:translate-x-1 transition-all duration-300"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}