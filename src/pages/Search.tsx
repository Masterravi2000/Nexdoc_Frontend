import React, { useState } from "react";
import TopSearchBar from "../components/search_bars/TopSearchBar";
import Result from "./Results";
import FileMetadataPanel from "../components/sidebars/FileMetadataPanel";

export interface SearchResult {
  content: string;
  score: number;
  file_name: string;
  file_type: string;
  page_number: number | null;
  slide_number: number | null;
  line_start: number | null;
  line_end: number | null;
}

export interface SearchResultsProps {
  results?: SearchResult[];
  selectedIndex?: number | null;
  onSelectResult?: (result: SearchResult, index: number) => void;
  emptyMessage?: string;
}

function Search() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const SAMPLE_RESULTS: SearchResult[] = [
    {
      content: "Thank You\nStamin",
      score: 0.43,
      file_name: "Stamin Presentation.pptx.pptx",
      file_type: "pptx",
      page_number: null,
      slide_number: 18,
      line_start: null,
      line_end: null,
    },
    {
      content: "Stamin an AI-powered personal health, fitness, and sport",
      score: 0.65,
      file_name: "Stamin Presentation.pptx.pptx",
      file_type: "pptx",
      page_number: null,
      slide_number: 3,
      line_start: null,
      line_end: null,
    },
    {
      content:
        "Unlike generic fitness apps, Stamin delivers expert-level guidance, adaptive workout ",
      score: 0.83,
      file_name: "Stamin Presentation.pptx.pptx",
      file_type: "pptx",
      page_number: null,
      slide_number: 13,
      line_start: null,
      line_end: null,
    },
    {
      content: "Stamin AI interacts naturally with the user, offering in",
      score: 0.88,
      file_name: "Stamin Presentation.pptx.pptx",
      file_type: "pptx",
      page_number: null,
      slide_number: 5,
      line_start: null,
      line_end: null,
    },
  ];

  const results = SAMPLE_RESULTS

  return (
    <div className="flex h-screen flex-col p-6">
      <TopSearchBar />
      <div className="flex flex-1 flex-row gap-4 py-5 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Result 
          results={results}
          selectedIndex={selectedIndex}
          onSelectResult={(_,index) => setSelectedIndex(index)}
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
