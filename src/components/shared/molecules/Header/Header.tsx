import React from "react";

/**
 * Header component that displays the CCBC logo and serves as the main navigation header
 * This component is designed to be visible across all pages of the application
 */
const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <img
                src="/src/components/shared/molecules/Header/ccbc_logo.svg"
                alt="CCBC Logo"
                className="h-full w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
