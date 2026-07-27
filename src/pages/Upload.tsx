import { useState, useRef, useCallback, type ComponentType } from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Plus,
  X,
  Check,
  type LucideProps,
  TriangleAlert,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { addAttachedFiles, removeAttachedFile, clearAttachedFiles } from "../redux/upload/uploadSlice";

type IconType = ComponentType<LucideProps>;

type FileTypeId = "pdf" | "xls" | "ppt" | "txt" | "img";

interface FileTypeConfig {
  id: FileTypeId;
  label: string;
  accept: string;
  icon: IconType;
  color: string;
  bg: string;
  chipBg: string;
  chipText: string;
  chipDot: string;
}

const FILE_TYPE_CONFIGS: FileTypeConfig[] = [
  {
    id: "pdf",
    label: "PDF",
    accept: ".pdf",
    icon: FileText,
    color: "text-red-500",
    bg: "bg-red-50",
    chipBg: "bg-red-50",
    chipText: "text-red-900",
    chipDot: "bg-red-300",
  },
  {
    id: "xls",
    label: "Excel",
    accept: ".xls,.xlsx",
    icon: FileSpreadsheet,
    color: "text-green-600",
    bg: "bg-green-50",
    chipBg: "bg-green-50",
    chipText: "text-green-900",
    chipDot: "bg-green-300",
  },
  {
    id: "ppt",
    label: "PowerPoint",
    accept: ".ppt,.pptx",
    icon: Presentation,
    color: "text-orange-500",
    bg: "bg-orange-50",
    chipBg: "bg-orange-50",
    chipText: "text-orange-900",
    chipDot: "bg-orange-300",
  },
  {
    id: "txt",
    label: "Text",
    accept: ".txt",
    icon: FileText,
    color: "text-gray-500",
    bg: "bg-gray-100",
    chipBg: "bg-gray-100",
    chipText: "text-gray-800",
    chipDot: "bg-gray-300",
  },
  {
    id: "img",
    label: "Images",
    accept: ".jpg,.jpeg,.png",
    icon: ImageIcon,
    color: "text-blue-500",
    bg: "bg-blue-50",
    chipBg: "bg-blue-50",
    chipText: "text-blue-900",
    chipDot: "bg-blue-300",
  },
];

const MAX_PER_TYPE = 5;
const MAX_TOTAL = 25;

interface UploadingFile {
  id: string;
  name: string;
  fileType: FileTypeId;
  progress: number;
  status: "uploading" | "done";
}

let idCounter = 0;
const nextId = () => `f-${idCounter++}`;

export interface UploadPageProps {
  onUploadComplete?: (files: UploadingFile[]) => void;
}

export default function Upload({
}: UploadPageProps) {

  const dispatch = useAppDispatch();

  const attached = useAppSelector(
    (state) => state.upload.attached,
  )

  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const fileInputRefs = useRef<Record<FileTypeId, HTMLInputElement | null>>({
    pdf: null,
    xls: null,
    ppt: null,
    txt: null,
    img: null,
  });
  const [notify, setNotify] = useState(false);

  const totalAttached = Object.values(attached).reduce(
    (sum, list) => sum + list.length,
    0,
  );

  const handleAddClick = (typeId: FileTypeId) => {
    fileInputRefs.current[typeId]?.click();
  };

  const handleFilesSelected = (
  typeId: FileTypeId,
  fileList: FileList | null,
) => {
  if (!fileList) return;

  const files = Array.from(fileList);
  const currentList = attached[typeId];

  const isDuplicate = files.some((file) =>
    currentList.some(
      (attachedFile) =>
        attachedFile.file.name === file.name &&
        attachedFile.file.size === file.size &&
        attachedFile.file.lastModified === file.lastModified,
    ),
  );

  if (isDuplicate) {
    setNotify(true);
  }

  const totalAttached = Object.values(attached).reduce(
    (sum, list) => sum + list.length,
    0,
  );

  const remainingSlots = Math.min(
    MAX_PER_TYPE - currentList.length,
    MAX_TOTAL - totalAttached,
  );

  const newFiles = files
    .filter(
      (file) =>
        !currentList.some(
          (attachedFile) =>
            attachedFile.file.name === file.name &&
            attachedFile.file.size === file.size &&
            attachedFile.file.lastModified === file.lastModified,
        ),
    )
    .slice(0, remainingSlots)
    .map((file) => ({
      id: nextId(),
      name: file.name,
      file,
    }));

  if (newFiles.length > 0) {
    dispatch(addAttachedFiles({ typeId, files: newFiles }));
  }
};

 const handleRemove = (typeId: FileTypeId, fileId: string) => {
  dispatch(removeAttachedFile({ typeId, fileId }));
};

  const simulateUpload = useCallback((file: UploadingFile) => {
    const step = () => {
      setUploading((prev) =>
        prev.map((f) => {
          if (f.id !== file.id || f.status === "done") return f;
          const next = Math.min(100, f.progress + Math.random() * 18 + 6);
          return {
            ...f,
            progress: next,
            status: next >= 100 ? "done" : "uploading",
          };
        }),
      );
    };
    const interval = setInterval(() => {
      step();
    }, 450);
    setTimeout(() => clearInterval(interval), 6000);
  }, []);

  const handleUpload = () => {
    const toUpload: UploadingFile[] = [];
    FILE_TYPE_CONFIGS.forEach((config) => {
      attached[config.id].forEach((af) => {
        toUpload.push({
          id: af.id,
          name: af.name,
          fileType: config.id,
          progress: 0,
          status: "uploading",
        });
      });
    });
    if (toUpload.length === 0) return;

    setUploading((prev) => [...prev, ...toUpload]);
    toUpload.forEach((f) => simulateUpload(f));
    dispatch(clearAttachedFiles());
  };

  return (
    <div className="flex relative h-full w-full flex-col bg-white px-6 py-6">
      {notify === true ? (
        <div className="flex absolute shadow-md px-2.5 self-center flex-row align-center justify-between w-[380px] py-2 rounded-xl bg-red-200">
          <div className="flex flex-row gap-3">
            <div className="p-2 rounded-lg bg-red-300 align-center justify-center">
              <TriangleAlert className="h-4 w-4 text-red-600" />
            </div>
            <h1 className="text-sm text-gray-900 self-center font-[500]">
              Same file is not allowed
            </h1>
          </div>
          <button onClick={() => setNotify(false)}>
            <X className="h-5 w-5 text-gray-800 mr-2" />
          </button>
        </div>
      ) : null}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-[600] text-gray-900">
            Upload documents
          </p>
          <p className="text-xs text-gray-400">
            Up to 5 files per type &middot; 25 files total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
            {totalAttached} / {MAX_TOTAL} attached
          </span>
          <button
            type="button"
            onClick={handleUpload}
            disabled={totalAttached === 0}
            className="rounded-full mr-2 bg-blue-500 border border-gray-200 shadow-sm px-6 py-2 text-sm font-semibold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <p className="text-md font-[500] text-white">Upload</p>
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Attach sections — each independently horizontally scrollable */}
      <div className="flex flex-col gap-4 py-4">
        {FILE_TYPE_CONFIGS.map((config) => {
          const Icon = config.icon;
          const files = attached[config.id];
          const atLimit =
            files.length >= MAX_PER_TYPE || totalAttached >= MAX_TOTAL;

          return (
            <div key={config.id}>
              <div className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-gray-900">
                <Icon className={`h-7 w-7 ${config.color}`} strokeWidth={2} />
                {config.label}
                <span className="font-normal text-gray-400">
                  &middot; {files.length}/{MAX_PER_TYPE}
                </span>
              </div>

              {/* Hidden input lives outside the scrollable row so it's never remounted */}
              <input
                ref={(el) => {
                  fileInputRefs.current[config.id] = el;
                }}
                type="file"
                multiple
                accept={config.accept}
                className="hidden"
                onChange={(e) => {
                  handleFilesSelected(config.id, e.target.files);
                  e.target.value = "";
                }}
              />

              {/* Individually horizontally scrollable row */}
              <div className="flex gap-2 ml-1 overflow-x-auto pb-1">
                {files.map((f) => (
                  <span
                    key={f.id}
                    className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg ${config.chipBg} py-1.5 pl-2.5 pr-1.5 text-xs ${config.chipText}`}
                  >
                    {f.name}
                    <button
                      type="button"
                      onClick={() => handleRemove(config.id, f.id)}
                      aria-label={`Remove ${f.name}`}
                      className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${config.chipDot} text-white hover:opacity-80`}
                    >
                      <X className="h-2.5 w-2.5" strokeWidth={2.5} />
                    </button>
                  </span>
                ))}

                <button
                  key="add-file-button"
                  type="button"
                  onClick={() => handleAddClick(config.id)}
                  disabled={atLimit}
                  className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-3 w-3" strokeWidth={2} />
                  Add file
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-gray-100" />

      {/* Uploading list — vertically scrollable as one unit */}
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <p className="mb-2 text-xs font-semibold text-gray-900">
          Uploading {uploading.length > 0 ? `(${uploading.length})` : ""}
        </p>
        <div className="flex-1 space-y-2 overflow-y-auto">
          {uploading.length === 0 && (
            <p className="py-8 text-center text-xs text-gray-400">
              Attached files will appear here once you press Upload.
            </p>
          )}
          {uploading.map((f) => {
            const config = FILE_TYPE_CONFIGS.find((c) => c.id === f.fileType)!;
            const Icon = config.icon;
            return (
              <div
                key={f.id}
                className="rounded-lg border border-gray-100 px-3.5 py-2.5"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon
                      className={`h-3.5 w-3.5 flex-shrink-0 ${config.color}`}
                      strokeWidth={1.8}
                    />
                    <span className="truncate text-xs text-gray-900">
                      {f.name}
                    </span>
                  </div>
                  {f.status === "done" ? (
                    <span className="flex flex-shrink-0 items-center gap-1 text-[11px] font-semibold text-green-600">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                      Uploaded
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[11px] text-gray-400">
                      {Math.round(f.progress)}%
                    </span>
                  )}
                </div>
                {f.status === "uploading" && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
