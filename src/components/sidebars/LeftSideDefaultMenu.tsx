import { useState, type ComponentType } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  Settings,
  Info,
  type LucideProps,
  Upload,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoIcon from "../svg_icons/LogoIcon";

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
      className={`flex w-full items-center gap-4 rounded-lg px-3 py-1.5 text-left text-[15px] transition-colors
        ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
    >
      {dotColor ? (
        <span
          className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColor}`}
        />
      ) : Icon ? (
        <Icon
          className={`h-[18px] w-[18px] flex-shrink-0 ${active ? "text-gray-900" : "text-gray-900"} ${iconClassName}`}
          strokeWidth={active ? 3 : 2.5}
        />
      ) : null}
      <span
        className={`truncate font-[600]  ${active ? "text-gray-900 font-bold" : "text-gray-900"} text-[14px]`}
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
    <div className="flex h-full w-full gap-5 flex-col bg-white border-r-[2px] border-gray-100">
      <nav className="flex h-full w-full flex-col">
        {/* Header */}
        <div className="flex flex-row p-4.5 px-6.5 h-[85px] items-center gap-2.5 border-b-[2px] border-gray-100">
          <div className="p-1 rounded-lg border-2 border-gray-800">
            <LogoIcon />
          </div>
          <h2 className="truncate text-[23px] font-[700] text-gray-800">Nexdoc</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 py-6.5">
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

      <nav className="flex w-full flex-col border-t-[2px] border-gray-100 p-4 py-5">
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
