import { createContext } from 'react'

export interface LogoutContextType {
  showLogoutDialog: (message?: string) => void
}

export const LogoutContext = createContext<LogoutContextType | undefined>(undefined)