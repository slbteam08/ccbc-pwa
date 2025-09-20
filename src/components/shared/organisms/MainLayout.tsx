import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main layout component that handles content display
 * Content is passed as children
 */
const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex-1 p-4 overflow-auto ${className}`}>
      {children}
    </div>
  );
};

export default MainLayout;
