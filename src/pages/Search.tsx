import { useState } from "react";
import TopSearchBar from "../components/search_bars/TopSearchBar";
import Result from "./Results";
import FileMetadataPanel from "../components/sidebars/FileMetadataPanel";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useLocation } from "react-router-dom";
import NexAi, { type NexAiMessage } from "../pages/Nexai";

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
  const [nexai, setNexAi] = useState(false);
  const [messages, setMessages] = useState<NexAiMessage[]>([]);
  const { results } = useSelector((state: RootState) => state.search);
  const location = useLocation();
  const selectedQuery = location.state?.query ?? "";

  return (
    <div className="flex bg-white h-screen flex-row">
      <div className="h-full w-full flex flex-col">
        <TopSearchBar
          initialQuery={selectedQuery}
          nexaiButton={setNexAi}
          nexai={nexai}
        />
        <div className="flex flex-1 flex-row p-6 gap-6 overflow-hidden">
          <div className="flex-1 min-h-0 bg-white border border-[2px] border-gray-100 rounded-3xl overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-rounded-full scrollbar-track-transparent">
            <Result
              results={results ?? []}
              selectedIndex={selectedIndex}
              onSelectResult={(_, index) => setSelectedIndex(index)}
            />
          </div>
          {nexai === false && (
            <div className="w-1/4 flex-shrink-0 min-h-0">
              <FileMetadataPanel
                result={selectedIndex !== null ? results[selectedIndex] : null}
              />
            </div>
          )}
        </div>
      </div>
      {/* nexai part */}
      {nexai === true ? (
        <div className="w-[40%] h-full flex flex-col bg-white">
          <NexAi
            nexaiButton={setNexAi}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Search;
