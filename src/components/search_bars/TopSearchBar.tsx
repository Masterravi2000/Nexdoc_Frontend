import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import searchApiThunk from "../../redux/search/searchThunk";
import { useAppDispatch } from "../../redux/hook";

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
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const trimedQuery = query.trim();
    if (!trimedQuery) return;
    const debounceTimer = setTimeout(() => {
      dispatch(searchApiThunk(trimedQuery));
    }, 200);
    return () => clearTimeout(debounceTimer);
  },[query, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearchChange(newQuery);
  };

  const handleClear = () => {
    setQuery("");
    onSearchChange("");
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    dispatch(searchApiThunk(trimmedQuery));
    onSubmit(trimmedQuery)
  };

  return (
    <div className="flex w-full items-center gap-3">
      <form
        onSubmit={handleSubmit}
        className="relative flex h-14 flex-1 items-center rounded-full bg-white pl-5 pr-4"
      >
        <Search className="h-5 w-5 flex-shrink-0 text-gray-400" strokeWidth={3} />
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
        className="flex px-8 py-4 mr-4 flex-shrink-0 items-center justify-center rounded-full bg-white hover:bg-gray-50"
      >
        <h1 className="text-md text-gray-700 font-[500]">Nex Ai</h1>
      </button>
    </div>
  );
}