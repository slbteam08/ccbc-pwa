import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  logined: boolean
  user: {
    id: string
    email: string
    name: string
    role?: string
    custom_fields?: {
      worshipid?: string
      [key: string]: string | number | boolean | null | undefined
    }
  } | null
  token: string | null
}

const initialState: AuthState = {
  logined: false,
  user: null,
  token: null,
}

/**
 * Auth slice for managing authentication state in Redux
 * Handles login, logout, and user profile state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set user as logged in with user data and token
     */
    loginSuccess: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
      state.logined = true
      state.user = action.payload.user
      state.token = action.payload.token
    },
    /**
     * Set user as logged out and clear all auth data
     */
    logout: (state) => {
      state.logined = false
      state.user = null
      state.token = null
    },
    /**
     * Update user profile data
     */
    updateUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload
    },
    /**
     * Initialize auth state from localStorage on app start
     */
    initializeAuth: (state, action: PayloadAction<{ token: string | null }>) => {
      if (action.payload.token) {
        state.logined = true
        state.token = action.payload.token
      } else {
        state.logined = false
        state.user = null
        state.token = null
      }
    },
  },
})

export const { loginSuccess, logout, updateUser, initializeAuth } = authSlice.actions
export default authSlice.reducer