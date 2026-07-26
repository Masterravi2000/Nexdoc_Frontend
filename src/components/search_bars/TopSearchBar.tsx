import { useState, useRef } from "react";
import { Search, X, MoreHorizontal } from "lucide-react";

export interface SearchHeaderSectionProps {
  initialQuery?: string;
  placeholder?: string;
  onSearchChange?: (query: string) => void;
  onSubmit?: (query: string) => void;
  onOpenFilters?: () => void;
  onOpenMore?: () => void;
}

export default function TopSearchBar({
  initialQuery = "",
  placeholder = "Search a topic, clause, or file name",
  onSearchChange = () => {},
  onSubmit = () => {},
  onOpenMore = () => {},
}: SearchHeaderSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearchChange("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <div className="flex w-full items-center gap-10">
      <form
        onSubmit={handleSubmit}
        className="relative flex h-14 flex-1 items-center rounded-xl border border-gray-100 bg-white pl-5 pr-4 shadow-sm"
      >
        <Search className="h-5 w-5 flex-shrink-0 text-gray-400" strokeWidth={1.8} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="ml-3 h-full flex-1 border-none bg-transparent text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-white hover:bg-gray-300"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        )}
      </form>

      <button
        type="button"
        onClick={onOpenMore}
        aria-label="More options"
        className="flex px-6 py-4 mr-4 rounded-1xl flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm hover:bg-gray-50"
      >
        <h1 className="text-md text-black font-[400]">Nex Ai</h1>
      </button>
    </div>
  );
}