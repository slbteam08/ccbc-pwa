import { useContext } from 'react'
import { LogoutContext } from '@/contexts/logoutContext'

/**
 * Hook to access logout context
 */
export const useLogout = () => {
  const context = useContext(LogoutContext)
  if (!context) {
    throw new Error('useLogout must be used within a LogoutProvider')
  }
  return context
}