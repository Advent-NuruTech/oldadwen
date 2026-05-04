// Format date professionally: Published 1st January 2026
export function formatProfessionalDate(date: any) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date.toDate
      ? date.toDate()
      : new Date(date);

  const day = d.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `Published on ${day}${daySuffix} ${d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })}`;
}

// Format date for filtering (YYYY-MM-DD)
export function formatDateForFilter(date: any) {
  if (!date) return "";
  const d =
    typeof date === "string"
      ? new Date(date)
      : date.toDate
      ? date.toDate()
      : new Date(date);
  return d.toISOString().split("T")[0];
}

// Strip HTML and extra whitespace
export function stripHtml(html?: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// Get 60-word preview safely with highlighting
export function getPreviewWithHighlight(content: string, searchTerm: string, limit = 60) {
  const clean = stripHtml(content);
  const words = clean.split(" ");
  const preview = words.length > limit ? words.slice(0, limit).join(" ") + "…" : clean;
  
  if (!searchTerm.trim()) return preview;
  
  const term = searchTerm.toLowerCase();
  const regex = new RegExp(`(${term})`, 'gi');
  return preview.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700">$1</mark>');
}

// Highlight text in string
export function highlightText(text: string, searchTerm: string) {
  if (!searchTerm.trim() || !text) return text;
  
  const term = searchTerm.toLowerCase();
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700">$1</mark>');
}

// Blog type
export type Blog = {
  id: string;
  title: string;
  content: string;
  imageURL?: string;
  author: string;
  createdAt?: any;
};