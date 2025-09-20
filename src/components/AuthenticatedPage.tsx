import React from "react";
import { useLogoutMutation } from "../store/apiSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout as logoutAction } from "../store/authSlice";

interface AuthenticatedPageProps {
  onLogout: () => void;
}

/**
 * Main authenticated page component
 * Shows only the login raw data for debugging purposes
 */
const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({ onLogout }) => {
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const { user, token, logined } = useAppSelector((state) => state.auth);

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

  /**
   * Get login raw data for display
   */
  const getLoginRawData = () => {
    const jwtFromStorage = localStorage.getItem("jwt");
    return {
      authState: {
        logined,
        user,
        token,
      },
      localStorage: {
        jwt: jwtFromStorage,
      },
      timestamp: new Date().toISOString(),
    };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Simple logout button */}
      <div className="mb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
        >
          🚪 Logout
        </button>
      </div>

      {/* Login Raw Data Display */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">📊 Login Raw Data</h1>
        <div className="bg-black rounded-lg p-4 overflow-auto">
          <pre className="text-sm text-green-300 whitespace-pre-wrap break-words">
            {JSON.stringify(getLoginRawData(), null, 2)}
          </pre>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm opacity-75">
            Current authentication state, user data, tokens, and profile information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedPage;
