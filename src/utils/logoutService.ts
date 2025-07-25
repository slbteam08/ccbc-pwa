// Global reference to the logout function for use in axios interceptor
let globalLogoutFunction: ((message?: string) => void) | null = null

/**
 * Set the global logout function reference
 * This is called by the LogoutProvider to make the function available to axios interceptor
 */
export const setGlobalLogoutFunction = (logoutFn: (message?: string) => void) => {
  globalLogoutFunction = logoutFn
}

/**
 * Get the global logout function for use in axios interceptor
 */
export const getGlobalLogoutFunction = () => globalLogoutFunction

/**
 * Clear the global logout function reference
 */
export const clearGlobalLogoutFunction = () => {
  globalLogoutFunction = null
}