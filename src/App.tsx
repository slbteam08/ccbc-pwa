import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { initializeAuth } from "@/store/authSlice";
import OneSignalInit from "@/components/OneSignalInit";
import { LogoutProvider } from "@/contexts/logoutProvider";
import Header from "@/components/shared/molecules/Header";
import MainLayout from "@/components/shared/organisms/MainLayout";
import Tabs from "@/components/shared/organisms/Tabs";
import LoginPage from "@/components/LoginPage";
import AuthenticatedPage from "@/components/AuthenticatedPage";
import QRcodePage from "@/components/QRcodePage";
import Icon from "@/components/shared/atoms/Icons/Icon";

/**
 * Main App component for the Church PWA
 * Handles authentication flow and provides consistent tab navigation
 */
function App() {
  const dispatch = useAppDispatch();
  const { logined } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("weekly");

  // Initialize authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    dispatch(initializeAuth({ token }));
  }, [dispatch]);

  /**
   * Handle successful login
   */
  const handleLoginSuccess = () => {
    console.log("Login successful");
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    console.log("Logout successful");
  };

  /**
   * Define tab items for the bottom menu navigation only
   */
  const tabItems = [
    {
      id: "weekly",
      label: "週刊",
      icon: "newspaper" as const,
    },
    {
      id: "sermon",
      label: "聽道",
      icon: "speech" as const,
    },
    {
      id: "qr",
      label: "QR-CODE",
      icon: "qrCode" as const,
    },
    {
      id: "courses",
      label: "課程",
      icon: "class" as const,
    },
    {
      id: "members",
      label: "會員區",
      icon: "ppl" as const,
    },
  ];

  /**
   * Get content for the active tab
   */
  const getTabContent = () => {
    switch (activeTab) {
      case "weekly":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="newspaper" />
              <h2 className="text-xl font-semibold mb-2">週刊</h2>
              <p className="text-gray-600">Church weekly newsletter</p>
            </div>
          </div>
        );
      case "sermon":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="speech" />
              <h2 className="text-xl font-semibold mb-2">聽道</h2>
              <p className="text-gray-600">Listen to sermons</p>
            </div>
          </div>
        );
      case "qr":
        return <QRcodePage />;
      case "courses":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="class" />
              <h2 className="text-xl font-semibold mb-2">課程</h2>
              <p className="text-gray-600">Church courses and classes</p>
            </div>
          </div>
        );
      case "members":
        return logined ? (
          <AuthenticatedPage onLogout={handleLogout} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        );
      default:
        return null;
    }
  };

  return (
    <LogoutProvider>
      <OneSignalInit />
      <div className="h-full w-full fixed  flex flex-col">
        <Header />
        <MainLayout>{getTabContent()}</MainLayout>
        <Tabs
          tabItems={tabItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </LogoutProvider>
  );
}

export default App;
