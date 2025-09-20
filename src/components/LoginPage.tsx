import React, { useState } from "react";
import { useLoginMutation } from "../store/apiSlice";
import { useAppDispatch } from "../store/hooks";
import { loginSuccess } from "../store/authSlice";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

/**
 * Login page component for user authentication
 * Handles user login and token storage
 * Updated to match Penpot design with light blue color scheme
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  /**
   * Handle form submission for user login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    try {
      const result = await login({ username, password }).unwrap();
      localStorage.setItem("jwt", result.token);

      // Dispatch login success to Redux store
      dispatch(
        loginSuccess({
          user: result.user,
          token: result.token,
        })
      );

      onLoginSuccess();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };



  return (
    <div className="h-full flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-sm mx-auto">
        {/* Main Login Container */}
        <div
          className="rounded-lg p-6 shadow-lg"
          style={{ backgroundColor: "#a5d1d8" }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded border border-white text-gray-800 placeholder-gray-600 focus:outline-none focus:border-gray-400 transition-all"
                style={{ backgroundColor: "#bfe4ea" }}
                placeholder="Username"
                required
              />
            </div>

            <div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded border border-white text-gray-800 placeholder-gray-600 focus:outline-none focus:border-gray-400 transition-all pr-12"
                  style={{ backgroundColor: "#bfe4ea" }}
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {!!error && (
              <div className="bg-red-100 border border-red-400 rounded p-3">
                <p className="text-red-700 text-sm">
                  {error && typeof error === "object" && "data" in error
                    ? (error.data as { message?: string })?.message ||
                      "Login failed"
                    : "Login failed. Please check your credentials."}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-3 px-4 rounded font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#55f2e2",
                color: "#333",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
