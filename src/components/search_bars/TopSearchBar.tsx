import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import {
  addRecentSearchThunk,
  searchApiThunk,
} from "../../redux/search/searchThunk";
import { useAppDispatch } from "../../redux/hook";
import NexaiLogo from "../svg_icons/NexaiLogo";

export interface SearchHeaderSectionProps {
  nexai?: boolean;
  nexaiButton?: React.Dispatch<React.SetStateAction<boolean>>;
  initialQuery?: string;
  placeholder?: string;
  onSearchChange?: (query: string) => void;
  onSubmit?: (query: string) => void;
  onOpenFilters?: () => void;
  onOpenMore?: () => void;
}

export default function TopSearchBar({
  nexai,
  nexaiButton,
  initialQuery = "",
  placeholder = "Search a topic, clause, or file name",
  onSearchChange = () => {},
  onSubmit = () => {},
  onOpenMore = () => {
    nexaiButton?.(true);
  },
}: SearchHeaderSectionProps) {
  const dispatch = useAppDispatch();

  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const trimedQuery = query.trim();
    if (!trimedQuery) return;
    const debounceTimer = setTimeout(() => {
      dispatch(
        searchApiThunk({
          query: trimedQuery,
          mode: "offline",
        }),
      );
    }, 200);
    const debounceTimer2 = setTimeout(() => {
      dispatch(addRecentSearchThunk(trimedQuery));
    }, 1000);
    return () => {
      clearTimeout(debounceTimer);
      clearTimeout(debounceTimer2);
    };
  }, [query, dispatch]);

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
    dispatch(
      searchApiThunk({
        query: trimmedQuery,
        mode: "offline",
      }),
    );
    dispatch(addRecentSearchThunk(trimmedQuery));
    onSubmit(trimmedQuery);
  };

  return (
    <div className="flex w-full items-center p-4.5 gap-4 border-b-[2px] h-[85px] min-h-[85px] flex-srink-0 border-gray-100">
      <form
        onSubmit={handleSubmit}
        className="relative flex h-14 flex-1 items-center rounded-2xl bg-white hover:bg-gray-50 pl-5 pr-4"
      >
        <Search
          className="h-5 w-5 flex-shrink-0 text-gray-500"
          strokeWidth={3}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="ml-3 h-full flex-1 border-none bg-transparent text-[15px] text-gray-900 placeholder:text-gray-600 focus:outline-none"
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

      {nexai === false && (
        <button
          type="button"
          onClick={onOpenMore}
          aria-label="More options"
          className="flex px-4.5 py-3.5 gap-2 flex-shrink-0 items-center justify-center rounded-2xl bg-white hover:bg-gray-50 border border-[2px] border-gray-100"
        >
          <NexaiLogo />
          <h1 className="text-md text-gray-800 pr-1 font-[500]">Nex ai</h1>
        </button>
      )}
    </div>
  );
}
