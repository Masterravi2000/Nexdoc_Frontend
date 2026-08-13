import { type ComponentType } from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  File as FileIcon,
  type LucideProps,
  LucideLassoSelect,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hook";
import downloadFileThunk from "../../redux/download/downloadThunk";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

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
  file_size: string | null;
  created_on: string | null;
  last_modified: string | null;
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
    bg: "bg-red-100",
    label: "PDF document",
  },
  pptx: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-100",
    label: "PowerPoint presentation",
  },
  ppt: {
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-100",
    label: "PowerPoint presentation",
  },
  xlsx: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Excel spreadsheet",
  },
  xls: {
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Excel spreadsheet",
  },
  docx: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-100",
    label: "Word document",
  },
  doc: {
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-100",
    label: "Word document",
  },
  txt: {
    icon: FileText,
    color: "text-gray-500",
    bg: "bg-gray-200",
    label: "Text file",
  },
  jpg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-100",
    label: "JPG image",
  },
  jpeg: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-100",
    label: "JPEG image",
  },
  png: {
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-100",
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
    rows.push({ label: "Slide No.", value: String(result.slide_number) });
  if (result.page_number != null)
    rows.push({ label: "Page No.", value: String(result.page_number) });
  if (result.file_size != null)
    rows.push({ label: "Size", value: String(result.file_size) });
  if (result.file_type != null)
    rows.push({ label: "Extension", value: String(result.file_type) });
  if (result.last_modified != null)
    rows.push({ label: "Modified", value: String(result.last_modified) });
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
  emptyMessage = "Select a search result to see its details.",
}: FileMetadataPanelProps) {
  const dispatch = useAppDispatch();
  const { loading } = useSelector((state: RootState) => state.download);
  if (!result) {
    return (
      <div className="flex rounded-3xl h-full bg-white w-full items-center justify-center px-6 border border-[2px] border-gray-100">
        <div className="flex flex-col items-center justify-center gap-2">
          <LucideLassoSelect className="w-10 h-10 text-[#C0C0C0]" />
          <p className="w-[150px] text-center text-[#C3C3C3] text-[13px]">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    if (!result) return;

    try {
      const blob = await dispatch(
        downloadFileThunk({
          file_name: result.file_name,
          file_type: result.file_type,
        }),
      ).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = result.file_name;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("File download failed:", error);
    }
  };

  const style = getFileTypeStyle(result.file_type);
  const Icon = style.icon;
  const detailRows = buildDetailRows(result);

  return (
    <div className="h-full w-full bg-white p-1 rounded-3xl border border-[2px] border-gray-100">
      <div className="flex h-full w-full flex-col px-5 py-6">
        <div
          className={`mb-4 flex h-[200px] w-full items-center justify-center rounded-2xl ${style.bg}`}
        >
          <Icon className={`h-18 w-18 ${style.color}`} strokeWidth={1.5} />
        </div>

        <div className="px-2 py-4">
          <h3 className="truncate text-[15px] font-semibold text-gray-900">
            {result.file_name}
          </h3>
          <p className="mb-5 text-[13px] text-gray-700">{style.label}</p>

          <p className="mb-2.5 text-xs font-medium text-gray-400">
            Matched content
          </p>
          <p className="mb-6 whitespace-pre-line rounded-xl bg-gray-200 px-4 p-3 text-[13px] text-gray-700">
            {result.content}...
          </p>

          <div className="flex flex-col px-2.5">
            <p className="mb-2.5 text-dm font-medium text-gray-500">Details</p>
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
        </div>

        <div className="mt-auto flex gap-2.5 px-2 item-center justify-center">
          {loading === true ? (
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
          ) : (
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 rounded-full bg-gray-300 py-2.5 text-[13px] font-medium text-white hover:bg-gray-200"
            >
              <p className="text-gray-800 text-[16px] font-[600]">Get File</p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
