import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { initializeAuth } from "@/store/authSlice";
import OneSignalInit from "@/components/OneSignalInit";
import { LogoutProvider } from "@/contexts/logoutProvider";
import Header from "@/components/shared/molecules/Header";
import MainLayout from "@/components/shared/organisms/MainLayout";
import Tabs from "@/components/shared/organisms/Tabs";
import WeeklyPage from "@/components/page/WeeklyPage";
import SermonPage from "@/components/page/SermonPage";
import QRcodePage from "@/components/QRcodePage";
import CoursesPage from "@/components/page/CoursesPage";
import MembersPage from "@/components/page/MembersPage";
import type { IconName } from "@/components/shared/atoms/Icons/iconList";

/**
 * Tab item interface for navigation
 */
interface TabItem {
  id: string;
  label: string;
  icon: IconName;
}

/**
 * Main App component for the Church PWA
 * Handles authentication flow and provides consistent tab navigation with React Router
 */
function App() {
  const dispatch = useAppDispatch();

  // Initialize authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    dispatch(initializeAuth({ token }));
  }, [dispatch]);

  /**
   * Define tab items for the bottom menu navigation
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

  return (
    <LogoutProvider>
      <OneSignalInit />
      <Router>
        <AppContent tabItems={tabItems} />
      </Router>
    </LogoutProvider>
  );
}

/**
 * App content component that uses React Router for navigation
 */
function AppContent({ tabItems }: { tabItems: TabItem[] }) {
  const location = useLocation();
  
  // Get current active tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname.slice(1); // Remove leading slash
    return path || "weekly"; // Default to weekly if on root
  };

  return (
    <div className="h-full w-full fixed flex flex-col">
      <Header />
      <MainLayout>
        <Routes>
          <Route path="/" element={<WeeklyPage />} />
          <Route path="/weekly" element={<WeeklyPage />} />
          <Route path="/sermon" element={<SermonPage />} />
          <Route path="/qr" element={<QRcodePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/members" element={<MembersPage />} />
        </Routes>
      </MainLayout>
      <Tabs
        tabItems={tabItems}
        activeTab={getActiveTabFromPath()}
        onTabChange={() => {}} // Will be handled by router navigation
      />
    </div>
  );
}

export default App;
