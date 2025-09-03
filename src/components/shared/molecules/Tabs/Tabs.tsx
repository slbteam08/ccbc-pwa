import React, { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Tab item interface for defining individual tab properties
 */
interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
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
  variant = "default"
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id);

  /**
   * Handle tab selection and notify parent component
   */
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = items.find(item => item.id === activeTab)?.content;

  if (variant === "bottom-menu") {
    return (
      <div className={cn("w-full", className)}>
        {/* Tab Content */}
        <div className="flex-1 p-4">
          {activeTabContent}
        </div>
        
        {/* Bottom Menu Tabs */}
        <div className="bg-white border-t border-gray-200 px-2 py-2">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                  "min-w-[68px] h-[72px] space-y-1",
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {item.icon && (
                  <div className="w-6 h-6 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}
                <span className="text-sm font-normal text-center leading-tight">
                  {item.label}
                </span>
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
              {item.icon}
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="p-4">
        {activeTabContent}
      </div>
    </div>
  );
};

export default Tabs;
export type { TabItem, TabsProps };
