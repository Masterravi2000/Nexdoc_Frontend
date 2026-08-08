import { useState, type ComponentType } from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  File as FileIcon,
  type LucideProps,
  BoxSelect,
  DownloadCloud,
  File,
} from "lucide-react";

type IconType = ComponentType<LucideProps>;

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

interface FileTypeStyle {
  icon: IconType;
  color: string;
  bg: string;
  label: string;
}

const FILE_TYPE_STYLES: Record<string, FileTypeStyle> = {
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-200", label: "PDF" },
  pptx: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-200",
    label: "PPTX",
  },
  ppt: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-200",
    label: "PPT",
  },
  xlsx: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-200",
    label: "XLSX",
  },
  xls: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-200",
    label: "XLS",
  },
  docx: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-200",
    label: "DOCX",
  },
  doc: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-200",
    label: "DOC",
  },
  txt: {
    icon: FileText,
    color: "text-gray-500",
    bg: "bg-gray-200",
    label: "TXT",
  },
  jpg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-200",
    label: "JPG",
  },
  jpeg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-200",
    label: "JPEG",
  },
  png: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-200",
    label: "PNG",
  },
};

const DEFAULT_FILE_TYPE_STYLE: FileTypeStyle = {
  icon: FileIcon,
  color: "text-gray-500",
  bg: "bg-gray-100",
  label: "FILE",
};

function getFileTypeStyle(fileType: string): FileTypeStyle {
  return FILE_TYPE_STYLES[fileType.toLowerCase()] ?? DEFAULT_FILE_TYPE_STYLE;
}

function formatLocation(result: SearchResult): string {
  const parts: string[] = [];
  if (result.slide_number != null) parts.push(`In Slide No. ${result.slide_number}`);
  if (result.page_number != null) parts.push(`In Page No. ${result.page_number}`);
  if (result.line_start != null && result.line_end != null) {
    parts.push(`Lines ${result.line_start}\u2013${result.line_end}`);
  } else if (result.line_start != null) {
    parts.push(`Line ${result.line_start}`);
  }
  return parts.join(" \u00b7 ");
}

export interface SearchResultsProps {
  results?: SearchResult[];
  selectedIndex?: number | null;
  onSelectResult?: (result: SearchResult, index: number) => void;
  emptyMessage?: string;
}

export default function Result({
  results = [],
  selectedIndex: controlledIndex,
  onSelectResult = () => {},
  emptyMessage = "No results found. Search something valid for seeing the result here",
}: SearchResultsProps) {
  const [internalIndex, setInternalIndex] = useState<number | null>(
    results.length > 0 ? 0 : null,
  );
  const selectedIndex =
    controlledIndex !== undefined ? controlledIndex : internalIndex;

  const handleSelect = (result: SearchResult, index: number) => {
    setInternalIndex(index);
    onSelectResult(result, index);
  };

  if (results.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center py-16">
        <div className="flex flex-col justify-center items-center gap-3">
          <File className="h-12 w-12 text-[#C0C0C0]" />
          <p className="w-[200px] text-[#C3C3C3] text-[15px] text-center">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-hidden">
      <div className="rounded-t-full flex flex-row justify-between items-center px-7 py-6">
        <span className="text-[11px] uppercase tracking-wide text-gray-400">
          Match
        </span>
        <span className="text-[11px] uppercase tracking-wide mr-2 text-gray-400">
          Extension
        </span>
      </div>

      <ul className="flex flex-col gap-5 px-6">
        {results.map((result, index) => {
          const style = getFileTypeStyle(result.file_type);
          const Icon = style.icon;
          const location = formatLocation(result);
          const isSelected = selectedIndex === index;

          return (
            <li key={`${result.file_name}-${index}`}>
              <button
                type="button"
                onClick={() => handleSelect(result, index)}
                className={`grid w-full grid-cols-[1fr_65px] items-center p-4 py-6 rounded-3xl text-left transition-colors ${
                  isSelected ? "bg-[#EBEBEB]" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${style.bg}`}
                  >
                    <Icon
                      className={`h-[21px] w-[21px] ${style.color}`}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[15px] leading-snug font-[600] text-gray-900">
                      {result.content}
                    </p>
                    <p className="truncate mt-1 text-sm text-gray-700">
                      {result.file_name}
                      {location ? ` \u00b7 ${location}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center">
                  <span className="text-xs font-[500] text-gray-900">{style.label}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
