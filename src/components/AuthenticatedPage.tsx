import React, { useState, useEffect } from "react";
import { useGetProfileQuery, useLogoutMutation } from "../store/apiSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout as logoutAction, updateUser } from "../store/authSlice";
import AuthExample from "./AuthExample";
import TestLogout from "./TestLogout";

interface AuthenticatedPageProps {
  onLogout: () => void;
}

/**
 * Main authenticated page component
 * Shows the main church app content for logged-in users
 */
const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({ onLogout }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAuthExample, setShowAuthExample] = useState(false);
  const {
    data: profile,
    error: profileError,
    isLoading: isLoadingProfile,
  } = useGetProfileQuery();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Handle 403 errors from profile query (token expiry)
  useEffect(() => {
    if (
      profileError &&
      typeof profileError === "object" &&
      "status" in profileError &&
      (profileError as { status: number }).status === 403
    ) {
      // Token is expired or invalid, logout user
      localStorage.removeItem("jwt");
      dispatch(logoutAction());
      onLogout();
    }
  }, [profileError, onLogout, dispatch]);

  // Update user profile in Redux when fetched
  useEffect(() => {
    if (profile) {
      dispatch(updateUser(profile));
    }
  }, [profile, dispatch]);

  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("jwt");
      dispatch(logoutAction());
      onLogout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col church-gradient text-white">
      <header className="glass-effect p-4 md:px-8 flex flex-col md:flex-row justify-between items-center shadow-lg">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0">
          🏛️ Church PWA
        </h1>
        <div className="flex items-center space-x-4">
          {/* User Profile Info */}
          <div className="flex items-center space-x-2">
            {isLoadingProfile && (
              <span className="text-sm opacity-75">Loading...</span>
            )}
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs opacity-75">{user.role || "User"}</p>
              </div>
            )}
            {!!profileError && (
              <span className="text-sm text-red-300">Profile Error</span>
            )}
          </div>

          {/* Online Status */}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
              isOnline
                ? "bg-green-500/20 border border-green-500/50 text-green-100"
                : "bg-red-500/20 border border-red-500/50 text-red-100"
            }`}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Welcome to Our Church Community
          </h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            Stay connected with our church family through this progressive web
            app.
          </p>
          {profile && (
            <p className="text-base opacity-75 mt-2">
              Hello, {profile.name}! 👋
            </p>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          <div
            className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse cursor-pointer"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
            onClick={() => setShowAuthExample(!showAuthExample)}
          >
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">
              🔐 Auth Demo
            </h3>
            <p className="opacity-90 leading-relaxed">
              Test authentication features and token expiry handling.
            </p>
          </div>

          <div
            className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse"
            style={{ animationDelay: "1s", animationDuration: "3s" }}
          >
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">
              📅 Events
            </h3>
            <p className="opacity-90 leading-relaxed">
              Stay updated with upcoming church events and activities.
            </p>
          </div>

          <div
            className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse"
            style={{ animationDelay: "2s", animationDuration: "3s" }}
          >
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">
              🙏 Prayer Requests
            </h3>
            <p className="opacity-90 leading-relaxed">
              Share and pray for one another in our community.
            </p>
          </div>

          <div
            className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse"
            style={{ animationDelay: "3s", animationDuration: "3s" }}
          >
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">
              📖 Sermons
            </h3>
            <p className="opacity-90 leading-relaxed">
              Access past sermons and spiritual resources.
            </p>
          </div>

          <div
            className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse"
            style={{ animationDelay: "4s", animationDuration: "3s" }}
          >
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">
              💬 Community
            </h3>
            <p className="opacity-90 leading-relaxed">
              Connect with fellow church members and share experiences.
            </p>
          </div>

          <div
            className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse"
            style={{ animationDelay: "5s", animationDuration: "3s" }}
          >
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">
              💝 Giving
            </h3>
            <p className="opacity-90 leading-relaxed">
              Support our church mission through secure online giving.
            </p>
          </div>
        </section>

        {/* Auth Example Component */}
        {showAuthExample && (
          <section className="mb-12">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-medium mb-2">Authentication Demo</h3>
              <p className="opacity-75">
                This component demonstrates the authentication APIs and token
                expiry handling.
              </p>
            </div>
            <div className="space-y-6">
              <TestLogout />
              <AuthExample />
            </div>
          </section>
        )}
      </main>

      <footer className="bg-black/20 p-4 text-center opacity-80">
        <p className="text-sm md:text-base">
          Built with React, TypeScript, RTK Query, Tailwind CSS & PWA support
        </p>
      </footer>
    </div>
  );
};

export default AuthenticatedPage;
