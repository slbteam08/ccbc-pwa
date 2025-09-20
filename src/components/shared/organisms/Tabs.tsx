import React from "react";
import { useNavigate } from "react-router-dom";
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
 * Provides tab switching functionality with icons and labels using React Router
 */
const Tabs: React.FC<TabsProps> = ({
  tabItems,
  activeTab,
  onTabChange,
  className = "",
}) => {
  const navigate = useNavigate();

  /**
   * Handle tab navigation using React Router
   */
  const handleTabClick = (tabId: string) => {
    // Navigate to the route
    const path = tabId === "weekly" ? "/" : `/${tabId}`;
    navigate(path);
    
    // Still call the onTabChange callback for any additional logic
    onTabChange(tabId);
  };

  return (
    <div className={`bg-white border-t border-gray-200 px-4 py-3 ${className}`}>
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 min-w-[68px] h-[81px] rounded-lg relative ${
              activeTab === item.id
                ? "text-church-green"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {/* Label - on top (hidden for QR code) */}
            {item.id !== "qr" && (
              <span className="text-[14px] font-normal text-center leading-tight relative z-10 px-1 mb-1">
                {item.label}
              </span>
            )}

            {/* Icon container - on bottom */}
            <div
              className={`flex items-center justify-center relative z-10 ${
                item.id === "qr" ? "w-[70px] h-[70px]" : "w-[50px] h-[50px]"
              }`}
            >
              <Icon
                name={item.icon}
                width={item.id === "qr" ? 70 : 40}
                iconColorClass={
                  activeTab === item.id ? "bg-church-green" : "bg-gray-600"
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
