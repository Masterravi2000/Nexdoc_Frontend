import { type ComponentType, useEffect } from "react";
import {
  Search,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Clock,
  type LucideProps,
  X,
  SearchCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useAppDispatch } from "../redux/hook";
import { fetchStatsThunk } from "../redux/stats/statsThunk";
import {
  deleteRecentSearchThunk,
  getRecentSearchThunk,
} from "../redux/search/searchThunk";

type IconType = ComponentType<LucideProps>;

interface FileTypeStat {
  id: string;
  extension: string;
  count: number;
  todayCount: number;
  icon: IconType;
  iconColor: string;
  iconBg: string;
  description: string;
}

const FILE_TYPE_STATS: FileTypeStat[] = [
  {
    id: "pdf",
    extension: ".pdf",
    count: 4,
    todayCount: 0,
    icon: FileText,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    description: "Portable document files",
  },
  {
    id: "xls",
    extension: ".xls",
    count: 6,
    todayCount: 0,
    icon: FileSpreadsheet,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    description: "Excel spreadsheets",
  },
  {
    id: "pptx",
    extension: ".pptx",
    count: 5,
    todayCount: 0,
    icon: Presentation,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    description: "PowerPoint presentations",
  },
  {
    id: "txt",
    extension: ".txt",
    count: 10,
    todayCount: 0,
    icon: FileText,
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
    description: "Plain text documents",
  },
  {
    id: "jpeg",
    extension: ".jpeg",
    count: 7,
    todayCount: 0,
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    description: "JPEG image files",
  },
  {
    id: "png",
    extension: ".png",
    count: 12,
    todayCount: 0,
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    description: "PNG image files",
  },
  {
    id: "jpg",
    extension: ".jpg",
    count: 14,
    todayCount: 0,
    icon: ImageIcon,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    description: "JPG image files",
  },
];

export interface NexdocDashboardProps {
  totalFiles?: number;
  filesAddedThisWeek?: number;
  searchesThisWeek?: number;
  fileTypeStats?: FileTypeStat[];
  onAddFiles?: () => void;
}

export default function Dashboard({}: NexdocDashboardProps) {
  const navigate = useNavigate();
  const { statsData } = useSelector((state: RootState) => state.stats);
  const dispatch = useAppDispatch();
  const { recentSearches } = useSelector((state: RootState) => state.search);
  const onOpenSearch = () => {
    navigate("/search");
  };

  const onSelectRecentSearch = (query: string) => {
    navigate("/search", {
      state: { query },
    });
  };

  useEffect(() => {
    dispatch(fetchStatsThunk());
    dispatch(getRecentSearchThunk());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    await dispatch(deleteRecentSearchThunk(id));
    dispatch(getRecentSearchThunk());
  };

  const fileTypeStats = FILE_TYPE_STATS.map((item) => ({
    ...item,
    count: statsData[`${item.id}_count` as keyof typeof statsData],
    todayCount: statsData[`${item.id}_today` as keyof typeof statsData],
  }));

  return (
    <div className="h-full flex flex-col gap-5 w-full bg-[#fcfcfc] min-w-[640px] overflow-y-auto px-6 py-6 md:px-10 md:py-8 scrollbar scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-rounded-full scrollbar-track-transparen">
      {/* Top row: brand + status */}
      <div className="flex bg-white p-5 px-7 rounded-full items-center justify-between border border-1 border-gray-100 shadow-md">
        <span className="text-lg font-semibold text-gray-900">Dashboard</span>
        <div className="flex items-center gap-2 rounded-full bg-gray-200 px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-600" />
          <span className="text-xs font-semibold text-gray-900">
            Offline &middot; Secured
          </span>
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-row justify-between items-end rounded-3xl bg-white p-8 border border-1 border-gray-100 shadow-md">
          <div className="sm:col-span-1">
            <p className="mb-1.5 text-sm font-bold text-gray-900">
              Total files indexed
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-800 sm:text-5xl">
                {statsData?.total_files}
              </p>
              <span className="text-lg font-medium text-green-600">
                +{statsData.today_files} Today
              </span>
            </div>
          </div>
          <div className="rounded-full py-2 px-4 bg-gray-200 justify-center items-center">
            <p className="text-gray-900 font-[500] text-sm">
              this week - {statsData.today_files}
            </p>
          </div>
        </div>
        <div className="flex flex-row rounded-3xl justify-between items-end bg-white p-8 border border-1 border-gray-100 shadow-md">
          <div>
            <p className="mb-1.5 text-sm font-bold text-gray-900">
              Searches this week
            </p>
            <p className="text-2xl font-bold text-gray-800 sm:text-5xl">
              {statsData.total_searches}
            </p>
          </div>
          <div className="rounded-full py-2 px-4 bg-gray-200 justify-center items-center">
            <p className="text-gray-900 font-[500] text-sm">
              Downloads Today - {statsData.total_downloads}
            </p>
          </div>
        </div>
      </div>
      {/* File type tiles */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {fileTypeStats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="rounded-3xl flex flex-col gap-5 p-6 py-7 bg-white text-center border border-1 border-gray-100 shadow-md"
            >
              <div className="flex flex-row items-center justify-between">
                <div className={`w-[45px] h-[45px]${item.iconBg}`}>
                  <Icon
                    className={`h-[45px] w-[45px] ${item.iconColor}`}
                    strokeWidth={2}
                  />
                </div>
                <p className="text-[20px] font-semibold text-gray-600 mr-2">
                  {item.extension}
                </p>
              </div>

              <div className="flex flex-row justify-between items-end">
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-lg text-left font-bold text-gray-900">
                    Total - {item.count}
                  </p>
                  <p className="truncate text-xs text-left">
                    {item.description}
                  </p>
                </div>
                <div className="bg-gray-200 rounded-full h-3 p-3 flex justify-center items-center">
                  <p className="text-gray-900 font-semibold text-[12px] font-[500]">
                    Today - {item.todayCount}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search bar (acts as a button to open the full search page) */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="p-4 gap-3 px-5 w-full items-center flex flex-row rounded-full bg-white hover:bg-gray-100 border border-1 border-gray-100 shadow-md"
      >
        <Search className=" text-gray-400" strokeWidth={2} />
        <p className="text-gray-400 font-[400] text-sm">
          Search a topic, clause, or file name
        </p>
      </button>

      {/* Recent searches */}
      <div className="flex flex-col bg-white rounded-3xl gap-4 w-full h-full p-6 border border-1 border-gray-100 shadow-md">
        <p className="textmd pl-1 font-medium text-gray-800">Recent searches</p>
        <div className="flex flex-wrap gap-2">
          {recentSearches.length === 0 ? (
            <div className="flex flex-1 flex-row pt-7 justify-center gap-2 items-center">
              <SearchCheck className="w-5 h-5 text-gray-400 font-[500]" />
              <p className="text-gray-400 text-[15px]">
                Recent searches will appear here
              </p>
            </div>
          ) : (
            recentSearches.map((search) => (
              <div className="flex items-center gap-1 rounded-full bg-gray-200 px-4 py-1.5 transition-colors hover:bg-gray-300 ">
                <button
                  type="button"
                  onClick={() => onSelectRecentSearch(search.query)}
                  className="flex flex-1 cursor-pointer items-center gap-2 text-left"
                >
                  <Clock
                    className="h-3.5 w-3.5 text-gray-600"
                    strokeWidth={1.8}
                  />
                  <span className="truncate">{search.query}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(search.id)}
                  className="cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-400"
                  aria-label="Delete recent search"
                >
                  <X className="h-3 w-3 text-gray-900" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
