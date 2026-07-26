import { type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Plus,
  Clock,
  type LucideProps,
} from "lucide-react";

type IconType = ComponentType<LucideProps>;

interface FileTypeStat {
  id: string;
  extension: string;
  count: number;
  icon: IconType;
  iconColor: string;
  iconBg: string;
}

const FILE_TYPE_STATS: FileTypeStat[] = [
  {
    id: "pdf",
    extension: ".pdf",
    count: 4,
    icon: FileText,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
  {
    id: "xls",
    extension: ".xls",
    count: 6,
    icon: FileSpreadsheet,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
  },
  {
    id: "pptx",
    extension: ".pptx",
    count: 5,
    icon: Presentation,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
  },
  {
    id: "txt",
    extension: ".txt",
    count: 10,
    icon: FileText,
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
  },
  {
    id: "jpeg",
    extension: ".jpeg",
    count: 7,
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    id: "png",
    extension: ".png",
    count: 12,
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    id: "jpg",
    extension: ".jpg",
    count: 14,
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
];

const RECENT_SEARCHES: string[] = [
  "termination clause",
  "Q3 liability report",
  "vendor NDA 2025",
  "audit checklist",
];

export interface NexdocDashboardProps {
  totalFiles?: number;
  filesAddedThisWeek?: number;
  searchesThisWeek?: number;
  fileTypeStats?: FileTypeStat[];
  recentSearches?: string[];
  onSelectRecentSearch?: (query: string) => void;
  onAddFiles?: () => void;
}

export default function Dashboard({
  totalFiles = 58,
  filesAddedThisWeek = 6,
  searchesThisWeek = 142,
  fileTypeStats = FILE_TYPE_STATS,
  recentSearches = RECENT_SEARCHES,
  onSelectRecentSearch = () => {},
  onAddFiles = () => {},
}: NexdocDashboardProps) {

  const navigate = useNavigate()

  const onOpenSearch = () => {
    navigate("/search")
  }

  return (
    <div className="h-full w-full min-w-[640px] overflow-y-auto bg-white px-6 py-6 md:px-10 md:py-8">
      {/* Top row: brand + status */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-lg font-semibold text-gray-900">Dashboard</span>
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-500">
            Offline &middot; secured
          </span>
        </div>
      </div>
      {/* Stats row */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm sm:col-span-1">
          <p className="mb-1.5 text-sm text-gray-500">Total files indexed</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-gray-900 sm:text-5xl">
              {totalFiles}
            </p>
            <span className="text-md font-medium text-green-600">
              +{filesAddedThisWeek} this week
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="mb-1.5 text-sm text-gray-500">Searches this week</p>
          <p className="text-2xl font-semibold text-gray-900 sm:text-5xl">
            {searchesThisWeek}
          </p>
        </div>
      </div>
      {/* File type tiles */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
        {fileTypeStats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="rounded-xl border py-8 border-gray-100 bg-white p-3 text-center shadow-sm"
            >
              <div
                className={`mx-auto mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-md ${item.iconBg}`}
              >
                <Icon
                  className={`h-[50px] w-[50px] ${item.iconColor}`}
                  strokeWidth={2}
                />
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {item.count}
              </p>
              <p className="text-[16px] text-gray-400">{item.extension}</p>
            </div>
          );
        })}
      </div>


      {/* Search bar (acts as a button to open the full search page) */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="relative mb-5 flex h-12 w-full items-center rounded-xl border-none bg-gray-100 pl-11 pr-4 text-left text-sm text-gray-400 hover:bg-gray-200"
      >
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400"
          strokeWidth={1.8}
        />
        Search a topic, clause, or file name
      </button>


      {/* Recent searches */}
      <p className="mb-2.5 text-sm font-medium text-gray-400">
        Recent searches
      </p>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((search) => (
          <button
            key={search}
            type="button"
            onClick={() => onSelectRecentSearch(search)}
            className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:border-gray-200 hover:bg-gray-50"
          >
            <Clock className="h-3.5 w-3.5 text-gray-400" strokeWidth={1.8} />
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}
