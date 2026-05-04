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
    <div className="sticky top-4 z-10 mb-8">
      {/* Search Toggle Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
            isSearching || hasActiveFilters
              ? "bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black"
              : "bg-white dark:bg-[#2A221C] text-gray-900 dark:text-[#F6F1EA] border border-gray-300 dark:border-[#6B4A2E]"
          }`}
        >
          {isSearching || hasActiveFilters ? (
            <>
              <Filter size={20} />
              <span>Search Active</span>
              <span className="ml-1 bg-white dark:bg-black text-[#6B4A2E] dark:text-[#D9A441] px-2 py-0.5 rounded-full text-xs">
                {resultCount}
              </span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Search Blogs</span>
            </>
          )}
        </button>
      </div>

      {/* Expanded Search Panel */}
      {isExpanded && (
        <div className="bg-white dark:bg-[#2A221C] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#6B4A2E] p-6 max-w-2xl mx-auto">
          {/* Search Type Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSearchType("text")}
              className={`px-4 py-2 rounded-lg transition ${
                searchType === "text"
                  ? "bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black"
                  : "bg-gray-100 dark:bg-[#1F1A16] text-gray-700 dark:text-[#D8C9B4]"
              }`}
            >
              Text Search
            </button>
            <button
              onClick={() => setSearchType("author")}
              className={`px-4 py-2 rounded-lg transition ${
                searchType === "author"
                  ? "bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black"
                  : "bg-gray-100 dark:bg-[#1F1A16] text-gray-700 dark:text-[#D8C9B4]"
              }`}
            >
              Author Filter
            </button>
            <button
              onClick={() => setSearchType("date")}
              className={`px-4 py-2 rounded-lg transition ${
                searchType === "date"
                  ? "bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black"
                  : "bg-gray-100 dark:bg-[#1F1A16] text-gray-700 dark:text-[#D8C9B4]"
              }`}
            >
              Date Filter
            </button>
          </div>

          {/* Text Search */}
          {searchType === "text" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search by title, content, or author..."
                value={filters.searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 dark:border-[#6B4A2E] bg-white dark:bg-[#2A221C] text-gray-900 dark:text-[#F6F1EA] placeholder-gray-500 dark:placeholder-[#A67C52] focus:outline-none focus:ring-2 focus:ring-[#D9A441] transition-all"
                autoFocus
              />
              <p className="text-sm text-gray-600 dark:text-[#D8C9B4]">
                Search through blog titles, content, and author names
              </p>
            </div>
          )}

          {/* Author Filter */}
          {searchType === "author" && (
            <div className="space-y-4">
              <select
                value={filters.authorFilter}
                onChange={(e) => handleAuthorFilterChange(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 dark:border-[#6B4A2E] bg-white dark:bg-[#2A221C] text-gray-900 dark:text-[#F6F1EA] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
              >
                <option value="all">All Authors</option>
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 dark:text-[#D8C9B4]">
                Filter blogs by specific authors
              </p>
            </div>
          )}

          {/* Date Filter */}
          {searchType === "date" && (
            <div className="space-y-4">
              <input
                type="date"
                value={filters.dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 dark:border-[#6B4A2E] bg-white dark:bg-[#2A221C] text-gray-900 dark:text-[#F6F1EA] focus:outline-none focus:ring-2 focus:ring-[#D9A441]"
              />
              <p className="text-sm text-gray-600 dark:text-[#D8C9B4]">
                Filter blogs by specific publish date
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-[#6B4A2E]">
            <div className="text-sm text-gray-600 dark:text-[#D8C9B4]">
              {hasActiveFilters ? (
                <>
                  Found {resultCount} of {totalCount} blogs
                  {filters.searchTerm && ` for "${filters.searchTerm}"`}
                  {filters.authorFilter !== "all" && ` by ${filters.authorFilter}`}
                  {filters.dateFilter && ` on ${filters.dateFilter}`}
                </>
              ) : (
                `Browse ${totalCount} blogs`
              )}
            </div>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-[#1F1A16] text-gray-700 dark:text-[#D8C9B4] rounded-lg hover:bg-gray-200 dark:hover:bg-[#6B4A2E] transition"
                >
                  <X size={16} />
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm bg-gradient-to-r from-[#6B4A2E] to-[#D9A441] text-white dark:text-black rounded-lg hover:opacity-90 transition"
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