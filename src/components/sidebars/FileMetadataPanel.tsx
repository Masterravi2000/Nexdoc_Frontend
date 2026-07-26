import { type ComponentType } from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  File as FileIcon,
  type LucideProps,
} from "lucide-react";

// NOTE: this shape must stay identical to the SearchResult interface
// defined in SearchResults.tsx — duplicated here only because the
// preview environment can't resolve cross-file imports. In your real
// app, delete this and import the shared type from one place instead.
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

type IconType = ComponentType<LucideProps>;

interface FileTypeStyle {
  icon: IconType;
  color: string;
  bg: string;
  label: string;
}

const FILE_TYPE_STYLES: Record<string, FileTypeStyle> = {
  pdf: {
    icon: FileText,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "PDF document",
  },
  pptx: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-50",
    label: "PowerPoint presentation",
  },
  ppt: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-50",
    label: "PowerPoint presentation",
  },
  xlsx: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Excel spreadsheet",
  },
  xls: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Excel spreadsheet",
  },
  docx: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "Word document",
  },
  doc: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "Word document",
  },
  txt: {
    icon: FileText,
    color: "text-gray-500",
    bg: "bg-gray-100",
    label: "Text file",
  },
  jpg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "JPG image",
  },
  jpeg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "JPEG image",
  },
  png: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-50",
    label: "PNG image",
  },
};

const DEFAULT_FILE_TYPE_STYLE: FileTypeStyle = {
  icon: FileIcon,
  color: "text-gray-500",
  bg: "bg-gray-100",
  label: "File",
};

function getFileTypeStyle(fileType: string): FileTypeStyle {
  return FILE_TYPE_STYLES[fileType.toLowerCase()] ?? DEFAULT_FILE_TYPE_STYLE;
}

interface DetailRow {
  label: string;
  value: string;
}

function buildDetailRows(result: SearchResult): DetailRow[] {
  const rows: DetailRow[] = [];
  if (result.slide_number != null)
    rows.push({ label: "Slide", value: String(result.slide_number) });
  if (result.page_number != null)
    rows.push({ label: "Page", value: String(result.page_number) });
  if (result.line_start != null && result.line_end != null) {
    rows.push({
      label: "Lines",
      value: `${result.line_start}\u2013${result.line_end}`,
    });
  } else if (result.line_start != null) {
    rows.push({ label: "Line", value: String(result.line_start) });
  }
  rows.push({ label: "Match score", value: result.score.toFixed(2) });
  return rows;
}

export interface FileMetadataPanelProps {
  result?: SearchResult | null;
  onOpen?: (result: SearchResult) => void;
  onShowInNexdoc?: (result: SearchResult) => void;
  emptyMessage?: string;
}

export default function FileMetadataPanel({
  result = null,
  onOpen = () => {},
  onShowInNexdoc = () => {},
  emptyMessage = "Select a search result to see its details.",
}: FileMetadataPanelProps) {
  if (!result) {
    return (
      <div className="flex h-full bg-purple-500 w-full items-center justify-center px-6 text-center text-sm text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  const style = getFileTypeStyle(result.file_type);
  const Icon = style.icon;
  const detailRows = buildDetailRows(result);

  return (
    <div className="h-full w-full border border-gray-100 shadow-lg p-1 rounded-2xl">
      <div className="flex h-full w-full flex-col px-5 py-6">
        <div
          className={`mb-4 flex h-[200px] w-full items-center justify-center rounded-2xl ${style.bg}`}
        >
          <Icon className={`h-18 w-18 ${style.color}`} strokeWidth={1.5} />
        </div>

        <div className="px-2">
          <h3 className="truncate text-[15px] font-semibold text-gray-900">
            {result.file_name}
          </h3>
          <p className="mb-4 text-[13px] text-gray-500">{style.label}</p>

          <p className="mb-2.5 text-xs font-medium text-gray-400">
            Matched content
          </p>
          <p className="mb-5 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-[13px] text-gray-700">
            {result.content}...
          </p>

          <p className="mb-2.5 text-xs font-medium text-gray-400">Details</p>
          <div className="mb-5 flex flex-col gap-2">
            {detailRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <span className="text-[13px] text-gray-500">{row.label}</span>
                <span className="text-[13px] font-medium text-gray-900">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex gap-2.5">
          <button
            type="button"
            onClick={() => onOpen(result)}
            className="flex-1 rounded-lg bg-gray-100 py-2.5 text-[13px] font-medium text-gray-900 hover:bg-gray-200"
          >
            Open
          </button>
          <button
            type="button"
            onClick={() => onShowInNexdoc(result)}
            className="flex-1 rounded-lg bg-blue-500 py-2.5 text-[13px] font-medium text-white hover:bg-blue-600"
          >
            Show in nexdoc
          </button>
        </div>
      </div>
    </div>
  );
}
