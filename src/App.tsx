import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { initializeAuth } from "@/store/authSlice";
import OneSignalInit from "@/components/OneSignalInit";
import LoginPage from "@/components/LoginPage";
import AuthenticatedPage from "@/components/AuthenticatedPage";
import { LogoutProvider } from "@/contexts/logoutProvider";

/**
 * Main App component for the Church PWA
 * Handles authentication flow and routing between login and authenticated states
 */
function App() {
  const dispatch = useAppDispatch();
  const { logined } = useAppSelector((state) => state.auth);

  // Initialize authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    dispatch(initializeAuth({ token }));
  }, [dispatch]);

  /**
   * Handle successful login
   */
  const handleLoginSuccess = () => {
    // Login success is now handled by Redux in the login components
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    // Logout is now handled by Redux in the logout components
  };

  return (
    <LogoutProvider>
      <OneSignalInit />
      {logined ? (
        <AuthenticatedPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </LogoutProvider>
  );
}

export default App;
