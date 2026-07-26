import { useState, type ComponentType } from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  File as FileIcon,
  type LucideProps,
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
  pdf: { icon: FileText, color: "text-red-500", bg: "bg-red-50", label: "PDF" },
  pptx: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-50",
    label: "PPTX",
  },
  ppt: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-50",
    label: "PPT",
  },
  xlsx: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "XLSX",
  },
  xls: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "XLS",
  },
  docx: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "DOCX",
  },
  doc: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "DOC",
  },
  txt: {
    icon: FileText,
    color: "text-gray-500",
    bg: "bg-gray-100",
    label: "TXT",
  },
  jpg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "JPG",
  },
  jpeg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "JPEG",
  },
  png: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-50",
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
  if (result.slide_number != null) parts.push(`Slide ${result.slide_number}`);
  if (result.page_number != null) parts.push(`Page ${result.page_number}`);
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
  emptyMessage = "No results found.",
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
      <div className="flex h-full w-full items-center justify-center py-16 text-sm text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col overflow-hidden">
      <div className="grid mb-5 rounded-lg grid-cols-[1fr_95px] items-center bg-gray-50 px-7 py-2">
        <span className="text-[11px] uppercase tracking-wide text-gray-400">
          Match
        </span>
        <span className="text-[11px] uppercase tracking-wide text-gray-400">
          Extension
        </span>
      </div>

      <ul className="flex flex-col gap-5 pr-4">
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
                className={`grid w-full grid-cols-[1fr_65px] items-center p-4 py-6 border rounded-2xl text-left transition-colors ${
                  isSelected ? "border-[#76AEF6]" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${style.bg}`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] ${style.color}`}
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg leading-snug font-[400] text-gray-800">
                      {result.content}
                    </p>
                    <p className="truncate mt-1 text-xs text-gray-500">
                      {result.file_name}
                      {location ? ` \u00b7 ${location}` : ""}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{style.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
