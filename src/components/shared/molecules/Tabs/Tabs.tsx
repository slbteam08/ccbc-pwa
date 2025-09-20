import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Icon from "@/components/shared/atoms/Icons/Icon";
import type { IconName } from "@/components/shared/atoms/Icons/iconList";

/**
 * Tab item interface for defining individual tab properties
 */
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode | IconName;
  content?: React.ReactNode;
}

/**
 * Props interface for the Tabs component
 */
interface TabsProps {
  items: TabItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: "default" | "bottom-menu";
}

/**
 * Tabs component for displaying tabbed content with support for icons and custom styling
 * Based on the church PWA bottom menu design from Penpot
 */
const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  onTabChange,
  className,
  variant = "default",
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id);

  /**
   * Handle tab selection and notify parent component
   */
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = items.find((item) => item.id === activeTab)?.content;

  if (variant === "bottom-menu") {
    return (
      <div className={cn("w-full h-full flex flex-col", className)}>
        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-auto">{activeTabContent}</div>

        {/* Bottom Menu Tabs - Fixed at bottom */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 mt-auto">
          <div className="flex justify-between items-center max-w-md mx-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center transition-all duration-200",
                  "min-w-[68px] h-[81px] rounded-lg relative",
                  activeTab === item.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                {/* Label - moved to top */}
                <span className="text-[14px] font-normal text-center leading-tight relative z-10 px-1 mb-1">
                  {item.label}
                </span>

                {/* Icon container - moved to bottom */}
                {item.icon && (
                  <div className="w-[50px] h-[50px] flex items-center justify-center relative z-10">
                    {typeof item.icon === "string" ? (
                      <Icon
                        name={item.icon as IconName}
                        width={40}
                        iconColorClass={
                          activeTab === item.id ? "bg-blue-600" : "bg-gray-600"
                        }
                      />
                    ) : (
                      item.icon
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("w-full", className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              "border-b-2 border-transparent hover:text-gray-700",
              activeTab === item.id
                ? "text-blue-600 border-blue-600"
                : "text-gray-500"
            )}
          >
            <div className="flex items-center space-x-2">
              {item.icon && (
                typeof item.icon === 'string' ? (
                  <Icon 
                    name={item.icon as IconName} 
                    width={20} 
                    iconColorClass={activeTab === item.id ? "bg-blue-600" : "bg-gray-500"} 
                  />
                ) : (
                  item.icon
                )
              )}
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">{activeTabContent}</div>
    </div>
  );
};

export default Tabs;
export type { TabItem, TabsProps };
