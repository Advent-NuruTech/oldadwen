"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

export type SearchFilters = {
  searchTerm: string;
  authorFilter: string;
  dateFilter: string;
};

type SearchBlogProps = {
  authors: string[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isSearching: boolean;
  resultCount: number;
  totalCount: number;
};

export default function SearchBlog({
  authors,
  filters,
  onFiltersChange,
  isSearching,
  resultCount,
  totalCount,
}: SearchBlogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchType, setSearchType] = useState<"text" | "author" | "date">("text");

  const handleSearchTermChange = (value: string) => {
    onFiltersChange({ ...filters, searchTerm: value });
  };

  const handleAuthorFilterChange = (value: string) => {
    onFiltersChange({ ...filters, authorFilter: value });
  };

  const handleDateFilterChange = (value: string) => {
    onFiltersChange({ ...filters, dateFilter: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: "",
      authorFilter: "all",
      dateFilter: "",
    });
    setIsExpanded(false);
    setSearchType("text");
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.authorFilter !== "all" ||
    filters.dateFilter;

  return (
    <div className="sticky top-4 z-10 mb-10">
      
      {/* BUTTON */}
      <div className="flex justify-center mb-5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition shadow ${
            isSearching || hasActiveFilters
              ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white"
              : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          {isSearching || hasActiveFilters ? (
            <>
              <Filter size={18} />
              <span>Search Active</span>
              <span className="ml-1 bg-white text-[#1D4ED8] px-2 py-0.5 rounded-full text-xs font-semibold">
                {resultCount}
              </span>
            </>
          ) : (
            <>
              <Search size={18} />
              <span>Search Blogs</span>
            </>
          )}
        </button>
      </div>

      {/* PANEL (PURE WHITE ALWAYS) */}
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 max-w-2xl mx-auto">

          {/* TABS */}
          <div className="flex gap-2 mb-6">
            {["text", "author", "date"].map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  searchType === type
                    ? "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "text" && "Text"}
                {type === "author" && "Author"}
                {type === "date" && "Date"}
              </button>
            ))}
          </div>

          {/* TEXT */}
          {searchType === "text" && (
            <input
              type="text"
              placeholder="Search blogs..."
              value={filters.searchTerm}
              onChange={(e) => handleSearchTermChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#2563EB] outline-none"
            />
          )}

          {/* AUTHOR */}
          {searchType === "author" && (
            <select
              value={filters.authorFilter}
              onChange={(e) => handleAuthorFilterChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">All Authors</option>
              {authors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          )}

          {/* DATE */}
          {searchType === "date" && (
            <input
              type="date"
              value={filters.dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#2563EB]"
            />
          )}

          {/* FOOTER */}
          <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {hasActiveFilters
                ? `${resultCount} of ${totalCount} results`
                : `${totalCount} blogs`}
            </p>

            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <X size={14} />
                  Clear
                </button>
              )}

              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}