import { useAppSelector } from "@/store/hooks";
import LoginPage from "@/components/LoginPage";
import AuthenticatedPage from "@/components/AuthenticatedPage";

/**
 * Members page component
 * Displays login page for unauthenticated users or member area for authenticated users
 */
function MembersPage() {
  const { logined } = useAppSelector((state) => state.auth);

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

  return logined ? (
    <AuthenticatedPage onLogout={handleLogout} />
  ) : (
    <LoginPage onLoginSuccess={handleLoginSuccess} />
  );
}

export default MembersPage;