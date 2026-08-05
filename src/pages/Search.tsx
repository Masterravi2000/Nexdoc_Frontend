import { useState } from "react";
import TopSearchBar from "../components/search_bars/TopSearchBar";
import Result from "./Results";
import FileMetadataPanel from "../components/sidebars/FileMetadataPanel";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export interface SearchResult {
  content: string;
  score: number;
  file_name: string;
  file_type: string;
  page_number: number | null;
  slide_number: number | null;
  file_size: string | null;
  created_on: string | null;
  last_modified: string | null;
}

export interface SearchResultsProps {
  results?: SearchResult[];
  selectedIndex?: number | null;
  onSelectResult?: (result: SearchResult, index: number) => void;
  emptyMessage?: string;
}

function Search() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { results } = useSelector(
    (state: RootState) => state.search,
  );

  return (
    <div className="flex bg-gray-200 h-screen flex-col p-6">
      <TopSearchBar />
      <div className="flex flex-1 flex-row gap-6 py-5 overflow-hidden">
        <div className="flex-1 bg-white rounded-4xl overflow-y-auto">
          <Result
            results={results ?? []}
            selectedIndex={selectedIndex}
            onSelectResult={(_, index) => setSelectedIndex(index)}
          />
        </div>
        <div className="w-1/4 flex-shrink-0">
          <FileMetadataPanel
            result={selectedIndex !== null ? results[selectedIndex] : null}
          />
        </div>
      </div>
    </div>
  );
}

export default Search;
