import { useState, type ComponentType } from "react";
import {
  Home,
  Clock,
  Settings,
  Info,
  type LucideProps,
  Upload,
  Search,
  FileSearchCornerIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type IconType = ComponentType<LucideProps>;

interface NavItem {
  id: string;
  label: string;
  icon: IconType;
}

interface TagItem {
  id: string;
  label: string;
  icon: IconType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "search", label: "Search", icon: Search },
  { id: "recents", label: "Recents", icon: Clock },
  { id: "upload", label: "Upload", icon: Upload },
];

const TAGS: TagItem[] = [
  { id: "Settings", label: "Settings", icon: Settings },
  { id: "About", label: "About", icon: Info },
];

interface RowButtonProps {
  icon?: IconType;
  iconClassName?: string;
  label: string;
  active: boolean;
  onClick: () => void;
  dotColor?: string;
}

function RowButton({
  icon: Icon,
  iconClassName = "",
  label,
  active,
  onClick,
  dotColor,
}: RowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4.5 rounded-full px-3 py-2 text-left text-[15px] transition-colors
        ${active ? "bg-white" : "hover:bg-gray-100"}`}
    >
      {dotColor ? (
        <span
          className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColor}`}
        />
      ) : Icon ? (
        <Icon
          className={`h-[20px] w-[20px] flex-shrink-0 ${active ? "text-gray-800" : "text-gray-800"} ${iconClassName}`}
          strokeWidth={2.5}
        />
      ) : null}
      <span
        className={`truncate font-[500]  ${active ? "text-gray-800" : "text-gray-800 "} text-[15px]`}
      >
        {label}
      </span>
    </button>
  );
}

export interface LeftSideDefaultMenuProps {
  onNavigate?: (id: string) => void;
  onSelectLocation?: (id: string) => void;
  onSelectTag?: (id: string) => void;
  onAddTag?: () => void;
  onQuickAccessDrop?: (e?: React.DragEvent<HTMLButtonElement>) => void;
}

export default function LeftSideDefaultMenu({
  onSelectTag = () => {},
  onQuickAccessDrop = () => {},
}: LeftSideDefaultMenuProps) {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleNavClick = (label: string) => {
    if (label === "Home") {
      setActiveNav("home");
      navigate("/");
    }
    if (label === "Upload") {
      setActiveNav("upload");
      navigate("/upload");
    }
    if (label === "Search") {
      setActiveNav("search");
      navigate("/search");
    }
  };

  const handleTagClick = (id: string) => {
    setActiveTag((prev) => (prev === id ? null : id));
    onSelectTag(id);
  };

  return (
    <div className="flex h-full w-full flex-col bg-gray-200 p-3 py-4 ">
      <nav className="flex h-full w-full flex-col rounded-2xl p-4">
        {/* Header */}
        <div className="mb-8 mr-4 mt-1 flex items-center gap-3 flex flex-row">
          <FileSearchCornerIcon className="w-7 h-7 text-gray-900 font-[700]"/>
          <h2 className="text-[25px] font-bold text-gray-900">Nexdoc</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Primary nav */}
          <div className="flex flex-col gap-2.5">
            {NAV_ITEMS.map((item) => (
              <RowButton
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeNav === item.id}
                onClick={() => handleNavClick(item.label)}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onQuickAccessDrop()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onQuickAccessDrop(e);
          }}
          className="mt-6 flex w-full hover:border-gray-300"
        >
          <div className="flex flex-col gap-2">
            {TAGS.map((tag) => (
              <RowButton
                key={tag.id}
                icon={tag.icon}
                label={tag.label}
                active={activeTag === tag.id}
                onClick={() => handleTagClick(tag.id)}
              />
            ))}
          </div>
        </button>
      </nav>
    </div>
  );
}
