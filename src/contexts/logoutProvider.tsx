import React, { useState, useCallback, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import LogoutDialog from "@/components/LogoutDialog";
import {
  setGlobalLogoutFunction,
  clearGlobalLogoutFunction,
} from "@/utils/logoutService";
import { LogoutContext } from "./logoutContext";
import type { LogoutContextType } from "./logoutContext";

interface LogoutProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that manages logout dialog state and Redux logout actions
 * This allows the axios interceptor to trigger logout dialogs
 */
export const LogoutProvider: React.FC<LogoutProviderProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>();
  const dispatch = useAppDispatch();

  // Global logout function that handles both Redux logout and dialog display
  const globalLogout = useCallback((message?: string) => {
    console.log('🔴 Global logout triggered with message:', message)
    console.log('🔴 Setting dialog open to true')
    dispatch(logout())
    setDialogMessage(message || 'Your session has expired. Please log in again.')
    setIsDialogOpen(true)
    console.log('🔴 Dialog state updated, isDialogOpen should be true')
  }, [dispatch])

  const showLogoutDialog = useCallback(
    (message?: string) => {
      globalLogout(message)
    },
    [globalLogout]
  );

  const handleCloseDialog = useCallback(() => {
    console.log('🔴 Dialog close triggered')
    setIsDialogOpen(false);
    setDialogMessage(undefined);
    // Redirect to login page after closing dialog
    window.location.href = '/'
  }, []);

  // Set the global logout function for axios interceptor
  useEffect(() => {
    setGlobalLogoutFunction(globalLogout)
    return () => clearGlobalLogoutFunction()
  }, [globalLogout]);

  const contextValue: LogoutContextType = {
    showLogoutDialog,
  };

  return (
    <LogoutContext.Provider value={contextValue}>
      {children}
      <LogoutDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        message={dialogMessage}
      />
    </LogoutContext.Provider>
  );
};
