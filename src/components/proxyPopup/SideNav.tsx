import React from "react";
import {
  MixerHorizontalIcon,
  Link2Icon,
  CodeIcon,
  CornerBottomRightIcon,
  GlobeIcon,
} from "@radix-ui/react-icons";

export type TabType = "header" | "route" | "script" | "redirect" | "proxy";

interface NavItem {
  key: TabType;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { key: "header", icon: <MixerHorizontalIcon className="w-4 h-4" />, label: "Header" },
  { key: "route", icon: <Link2Icon className="w-4 h-4" />, label: "Route" },
  { key: "script", icon: <CodeIcon className="w-4 h-4" />, label: "Script" },
  { key: "redirect", icon: <CornerBottomRightIcon className="w-4 h-4" />, label: "Redirect" },
  { key: "proxy", icon: <GlobeIcon className="w-4 h-4" />, label: "Proxy" },
];

interface SideNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const SideNav = ({ activeTab, onTabChange }: SideNavProps) => {
  return (
    <div className="flex flex-col items-center py-2 gap-1 w-12 bg-[#f8f9fa] border-r border-[#eee]">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => onTabChange(item.key)}
          className={`w-9 h-9 flex flex-col items-center justify-center rounded cursor-pointer transition-all ${
            activeTab === item.key
              ? "bg-[#233895] text-white shadow-sm"
              : "text-[#666] hover:bg-[#e8e8e8]"
          }`}
          title={item.label}
        >
          {item.icon}
          <span className="text-[8px] mt-0.5 leading-none">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SideNav;
