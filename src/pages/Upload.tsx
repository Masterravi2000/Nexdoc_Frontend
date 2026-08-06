import {
  useState,
  useRef,
  useCallback,
  type ComponentType,
  useEffect,
} from "react";
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
  ArrowRightIcon,
  ArrowLeft,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  addAttachedFiles,
  removeAttachedFile,
  clearAttachedFiles,
  clearFailedFiles,
} from "../redux/upload/uploadSlice";
import {
  uploadImageThunk,
  uploadPdfThunk,
  uploadPptxThunk,
  uploadTxtThunk,
  uploadXlsThunk,
} from "../redux/upload/uploadThunk";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { fetchUploadStatusThunk } from "../redux/status/fetchUploadStatusThunk";

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
  progressBar: string;
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
    progressBar: "bg-red-500",
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
    progressBar: "bg-green-500",
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
    progressBar: "bg-orange-500",
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
    progressBar: "bg-gray-500",
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
    progressBar: "bg-blue-500",
  },
];

const MAX_PER_TYPE = 5;
const MAX_TOTAL = 25;

interface UploadingFile {
  id: string;
  name: string;
  fileType: FileTypeId;
  progress: number;
  status: "uploading" | "done" | "failed";
}

let idCounter = 0;
const nextId = () => `f-${idCounter++}`;

export interface UploadPageProps {
  onUploadComplete?: (files: UploadingFile[]) => void;
}

export default function Upload({}: UploadPageProps) {
  const dispatch = useAppDispatch();
  const { uploadedFiles } = useSelector((state: RootState) => state.upload);
  const failedFiles = useSelector(
    (state: RootState) => state.upload.failedFiles,
  );
  const [failedFileSection, setFailedFilesSection] = useState(false);

  const attached = useAppSelector((state) => state.upload.attached);

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

  const updateUploadProgress = useCallback((fileId: string, status: string) => {
    const progressMap: Record<string, number> = {
      queued: 20,
      processing: 40,
      chunking: 60,
      embedding: 80,
      storing: 90,
      completed: 100,
      failed: 0,
    };

    setUploading((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: progressMap[status] ?? 0,
              status:
                status === "completed"
                  ? "done"
                  : status === "failed"
                    ? "failed"
                    : "uploading",
            }
          : file,
      ),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      uploadedFiles.forEach((file) => {
        if (file.status) {
          updateUploadProgress(file.fileId, file.status);
        }

        if (file.status === "completed" || file.status === "failed") return;

        dispatch(fetchUploadStatusThunk(file.fileId));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [uploadedFiles, dispatch, updateUploadProgress]);

  useEffect(() => {
    setUploading((prev) => {
      const existingIds = new Set(prev.map((file) => file.id));

      const newFiles: UploadingFile[] = uploadedFiles
        .filter((file) => !existingIds.has(file.fileId))
        .map((file) => ({
          id: file.fileId,
          name: file.filename,
          fileType: file.fileType,
          progress: 20,
          status: "uploading",
        }));

      return [...newFiles, ...prev];
    });
  }, [uploadedFiles]);

  const handleUpload = () => {
    dispatch(clearFailedFiles());
    //for image upload
    if (attached.img.length > 0) {
      const imageData = new FormData();
      attached.img.forEach((file) => {
        imageData.append("files", file.file);
        imageData.append("last_modified", String(file.file.lastModified));
      });
      dispatch(uploadImageThunk(imageData));
    }
    //for pdf upload
    if (attached.pdf.length > 0) {
      const pdfData = new FormData();
      attached.pdf.forEach((file) => {
        pdfData.append("files", file.file);
        pdfData.append("last_modified", String(file.file.lastModified));
      });
      dispatch(uploadPdfThunk(pdfData));
    }
    //for pptx upload
    if (attached.ppt.length > 0) {
      const pptData = new FormData();
      attached.ppt.forEach((file) => {
        pptData.append("files", file.file);
        pptData.append("last_modified", String(file.file.lastModified));
      });
      dispatch(uploadPptxThunk(pptData));
    }
    //for xls upload
    if (attached.xls.length > 0) {
      const xlsData = new FormData();
      attached.xls.forEach((file) => {
        xlsData.append("files", file.file);
        xlsData.append("last_modified", String(file.file.lastModified));
      });
      dispatch(uploadXlsThunk(xlsData));
    }
    //for txt upload
    if (attached.txt.length > 0) {
      const txtData = new FormData();
      attached.txt.forEach((file) => {
        txtData.append("files", file.file);
        txtData.append("last_modified", String(file.file.lastModified));
      });
      dispatch(uploadTxtThunk(txtData));
    }
    dispatch(clearAttachedFiles());
  };

  const getFailedFileConfig = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return { icon: FileText, color: "text-red-500" };

      case "xlsx":
      case "xls":
        return { icon: FileSpreadsheet, color: "text-green-600" };

      case "ppt":
      case "pptx":
        return { icon: Presentation, color: "text-orange-500" };

      case "jpg":
      case "jpeg":
      case "png":
        return { icon: ImageIcon, color: "text-blue-500" };

      case "txt":
        return { icon: FileText, color: "text-gray-500" };

      default:
        return { icon: File, color: "text-gray-500" };
    }
  };

  return (
    <div className="flex h-full gap-4 w-full flex-col bg-gray-100 p-6">
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
      <div className=" flex py-5 px-6 rounded-3xl bg-white items-center justify-between">
        <div className="flex flex-col">
          <p className="text-lg font-[700] text-gray-800">Upload documents</p>
          <p className="text-xs text-gray-600 ml-0.5">
            Up to 5 files per type &middot; 25 files total
          </p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-[500] text-gray-700">
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

      <div className="flex min-w-0 flex-row gap-4 overflow-hidden">
        {/* Attach sections — each independently horizontally scrollable */}
        <div className="min-w-0 flex-1 overflow-hidden bg-white gap-4 px-6 py-7 rounded-3xl">
          {FILE_TYPE_CONFIGS.map((config) => {
            const Icon = config.icon;
            const files = attached[config.id];
            const atLimit =
              files.length >= MAX_PER_TYPE || totalAttached >= MAX_TOTAL;

            return (
              <div key={config.id} className="h-[80px]">
                <div className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold text-gray-900">
                  <Icon className={`h-7 w-7 ${config.color}`} strokeWidth={2} />
                  <h1 className="text-gray-900 font-[500] text-[17px]">
                    {config.label}
                  </h1>
                  <span className="font-normal text-gray-700">
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
                <div className="flex gap-2 ml-1 min-w-0 overflow-x-auto overflow-y-hidden pb-1 scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-rounded-full scrollbar-track-transparen">
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
                    className="flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-dashed border-gray-500 px-5 py-1.5 text-xs text-gray-500 hover:border-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-3 w-3" strokeWidth={2} />
                    Add file
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* failed file pannel details */}
        {failedFileSection === true ? (
          <div className="h-full">
            <div className="h-full flex flex-srink-0 flex-col w-[250px] z-100 bg-red-200 rounded-3xl p-4 item-center justify-center">
              {/* Header Section */}
              <div className="flex flex-row justify-between">
                <h1 className="text-xl text-red-500 font-[700] ml-1">
                  Failed files
                </h1>
                <button
                  onClick={() => setFailedFilesSection(false)}
                  className="rounded-full p-1 bg-red-300 hover:bg-red-400"
                >
                  <ArrowRightIcon
                    className="h-4 w-7 text-red-600"
                    strokeWidth={3}
                  />
                </button>
              </div>
              {/* body */}
              <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1 scrollbar scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-rounded-full scrollbar-track-transparent">
                {failedFiles.length === 0 ? (
                  <p className="py-10 text-center text-sm mt-6 text-red-400">
                    No failed file
                  </p>
                ) : (
                  failedFiles.map((file) => {
                    const { icon: Icon, color } = getFailedFileConfig(
                      file.fileType,
                    );
                    return (
                      <div
                        key={`${file.filename}-${file.fileType}`}
                        className="rounded-lg p-2.5"
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <Icon
                            className={`h-5 w-5 flex-shrink-0 ${color}`}
                            strokeWidth={2}
                          />
                          <span className="truncate text-[14px] font-medium text-gray-800">
                            {file.filename}
                          </span>
                        </div>
                        <p className="text-[11.5px] leading-snug text-gray-800">
                          {file.error}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="z-100 w-[50px] flex-shrink-0 flex flex-col right-5 h-[450px] justify-between item-center bg-red-200 rounded-full p-2">
            <button
              onClick={() => setFailedFilesSection(true)}
              className="p-2 rounded-full bg-red-300 mt-0.1 hover:bg-red-400"
            >
              <ArrowLeft
                className="text-red-600 w-4 h-4 font-[600]"
                strokeWidth={3}
              />
            </button>
            <div className="flex h-full w-full flex-col justify-center items-center">
              <p className="rotate-90 text-red-500 font-[600] text-lg mb-5">
                Failed
              </p>
              <p className="rotate-90 text-red-500 font-[600] text-lg mb-6">
                Files
              </p>
              <p className="rotate-90 text-red-500 font-[600] text-lg mb-6">
                Pannel
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Uploading list — vertically scrollable as one unit */}
      <div className="flex min-h-0 flex-1 flex-col bg-white rounded-3xl p-5 ">
        <p className="mb-2 text-md font-semibold text-gray-900">
          Uploading {uploading.length > 0 ? `(${uploading.length})` : ""}
        </p>
        <div className="flex-1 overflow-x-auto space-y-2 p-2 scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-rounded-full scrollbar-track-transparen">
          {uploading.length === 0 && (
            <p className="text-center mt-14 text-md self-center text-gray-400">
              Uploading files will appear here.
            </p>
          )}
          {uploading.map((f) => {
            const config = FILE_TYPE_CONFIGS.find((c) => c.id === f.fileType)!;
            const Icon = config.icon;
            return (
              <div
                key={f.id}
                className="rounded-lg border border-gray-100 px-4 py-2.5"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon
                      className={`h-8 w-8 flex-shrink-0 ${config.color}`}
                      strokeWidth={2.5}
                    />
                    <span className="truncate text-lg text-gray-900">
                      {f.name}
                    </span>
                  </div>
                  {f.status === "done" ? (
                    <span className="flex flex-shrink-0 items-center gap-1 text-[14px] mr-2 font-semibold text-green-600">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                      Uploaded
                    </span>
                  ) : f.status === "failed" ? (
                    <span className="flex items-center gap-1 text-[14px] mr-2 font-semibold text-red-600">
                      <X className="h-3 w-3" strokeWidth={2.5} />
                      Failed
                    </span>
                  ) : (
                    <span className="flex-shrink-0 text-[14px] text-gray-500">
                      {Math.round(f.progress)}%
                    </span>
                  )}
                </div>
                {f.status === "uploading" && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${config.progressBar}`}
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
