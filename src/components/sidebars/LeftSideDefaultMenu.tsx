import { useState, type ComponentType } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
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
      className={`flex w-full items-center gap-5 rounded-full px-3 py-2 text-left text-[15px] transition-colors
        ${active ? "bg-gray-100" : "hover:bg-gray-100"}`}
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
  const location = useLocation();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleNavClick = (label: string) => {
    if (label === "Home") {
      navigate("/");
    }
    if (label === "Upload") {
      navigate("/upload");
    }
    if (label === "Search") {
      navigate("/search");
    }
  };

  const handleTagClick = (id: string) => {
    setActiveTag((prev) => (prev === id ? null : id));
    onSelectTag(id);
  };

  return (
    <div className="flex h-full w-full gap-5 flex-col bg-gray-100 pt-5 pl-5 pb-7">
      <nav className="flex h-full w-full bg-white flex-col rounded-3xl p-4">
        {/* Header */}
        <div className="mb-8 mt-1 p-2 flex items-center gap-3 flex flex-row">
          <FileSearchCornerIcon className="w-6 h-6 text-gray-800 font-[800]" />
          <h2 className="text-[20px] font-[500] text-gray-800">Nexdoc</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Primary nav */}
          <div className="flex flex-col gap-2.5">
            {NAV_ITEMS.map((item) => (
              <RowButton
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={
                  location.pathname === `/${item.id}` ||
                  (item.id === "home" && location.pathname === "/")
                }
                onClick={() => handleNavClick(item.label)}
              />
            ))}
          </div>
        </div>
      </nav>

      <nav className="flex w-full bg-white flex-col rounded-3xl p-4">
        <button
          type="button"
          onClick={() => onQuickAccessDrop()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onQuickAccessDrop(e);
          }}
          className="mt-1 flex w-full hover:border-gray-300"
        >
          <div className="flex w-full flex-col gap-2">
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
