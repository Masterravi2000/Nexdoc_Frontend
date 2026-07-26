import { useState, type ComponentType } from "react";
import {
  Home,
  Clock,
  Star,
  Settings,
  Info,
  type LucideProps,
} from "lucide-react";

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
  { id: "recents", label: "Recents", icon: Clock },
  { id: "favorites", label: "Upload", icon: Star },
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
      className={`flex w-full items-center gap-4.5 rounded-lg px-3 py-2 text-left text-[14px] transition-colors
        ${active ? "bg-white font-semibold text-gray-900" : "text-gray-800 hover:bg-gray-100"}`}
    >
      {dotColor ? (
        <span
          className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${dotColor}`}
        />
      ) : Icon ? (
        <Icon
          className={`h-[22px] w-[22px] flex-shrink-0 text-gray-500 ${iconClassName}`}
          strokeWidth={1.8}
        />
      ) : null}
      <span className="truncate text-[16px]">{label}</span>
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
  onNavigate = () => {},
  onSelectTag = () => {},
  onQuickAccessDrop = () => {},
}: LeftSideDefaultMenuProps) {
  const [activeNav, setActiveNav] = useState<string | null>("recents");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    onNavigate(id);
  };

  const handleTagClick = (id: string) => {
    setActiveTag((prev) => (prev === id ? null : id));
    onSelectTag(id);
  };

  return (
    <nav className="flex h-full w-full flex-col bg-gray-50 p-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-3">
        <h2 className="text-[25px] font-bold text-gray-900">Nexdoc</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Primary nav */}
        <div className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => (
            <RowButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.id}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </div>

      </div>

      <div className="w-full h-[1px] bg-gray-300" />

      {/* Quick access */}
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
  );
}
