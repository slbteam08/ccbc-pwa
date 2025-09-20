import React from "react";
import Icon from "@/components/shared/atoms/Icons/Icon";
import type { IconName } from "@/components/shared/atoms/Icons/iconList";

/**
 * Tab item interface for navigation
 */
interface TabItem {
  id: string;
  label: string;
  icon: IconName;
}

interface TabsProps {
  tabItems: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * Tabs component that handles bottom navigation tabs
 * Provides tab switching functionality with icons and labels
 */
const Tabs: React.FC<TabsProps> = ({
  tabItems,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`bg-white border-t border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 min-w-[68px] h-[81px] rounded-lg relative ${
              activeTab === item.id
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {/* Label - on top */}
            <span className="text-[14px] font-normal text-center leading-tight relative z-10 px-1 mb-1">
              {item.label}
            </span>

            {/* Icon container - on bottom */}
            <div className="w-[50px] h-[50px] flex items-center justify-center relative z-10">
              <Icon
                name={item.icon}
                width={40}
                iconColorClass={
                  activeTab === item.id ? "bg-blue-600" : "bg-gray-600"
                }
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;