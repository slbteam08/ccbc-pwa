import React, { useState, useEffect } from 'react'
import {
  useLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
} from '../store/apiSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loginSuccess, logout as logoutAction } from '../store/authSlice'
import { useLogout } from '@/hooks/useLogout'

/**
 * Example component demonstrating authentication API usage
 * Shows how to login, fetch profile, and handle token expiry
 */
const AuthExample: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { logined } = useAppSelector((state) => state.auth)
  const { showLogoutDialog } = useLogout()

  const [login, { isLoading: isLoggingIn }] = useLoginMutation()
  const [logout] = useLogoutMutation()
  const {
    data: profile,
    error: profileError,
    isLoading: isLoadingProfile,
  } = useGetProfileQuery(undefined, {
    skip: !logined, // Only fetch profile if logged in
  })

  // Handle 403 errors from profile query (token expiry)
  useEffect(() => {
    if (profileError && typeof profileError === 'object' && 'status' in profileError && (profileError as { status: number }).status === 403) {
      // Token is expired or invalid, show logout dialog
      localStorage.removeItem('jwt')
      dispatch(logoutAction())
      showLogoutDialog('Your session has expired. Please log in again.')
    }
  }, [profileError, dispatch, showLogoutDialog])

  /**
   * Handle user login
   */
  const handleLogin = async () => {
    try {
      const result = await login({ email, password }).unwrap()
      localStorage.setItem('jwt', result.token)
      
      // Dispatch login success to Redux store
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }))
      
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please check your credentials.')
    }
  }

  /**
   * Handle user logout
   */
  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      localStorage.removeItem('jwt')
      dispatch(logoutAction())
    }
  }

  /**
   * Test auth API call to trigger potential 403 error
   */
  const testAuthCall = async () => {
    try {
      // Force a new profile query by using the mutation directly
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.status === 403) {
        // Handle 403 error manually - show logout dialog
        localStorage.removeItem('jwt')
        dispatch(logoutAction())
        showLogoutDialog('Your session has expired. Please log in again.')
      }
    } catch (error) {
      console.error('Test auth call failed:', error)
    }
  }

  if (!logined) {
    return (
      <div className="glass-effect rounded-2xl p-6 md:p-8 max-w-md mx-auto">
        <h3 className="text-xl md:text-2xl font-medium mb-6 text-center">
          🔐 Login Example
        </h3>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40"
          />
          <button
            onClick={handleLogin}
            disabled={isLoggingIn || !email || !password}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-effect rounded-2xl p-6 md:p-8 max-w-md mx-auto">
      <h3 className="text-xl md:text-2xl font-medium mb-6 text-center">
        👤 User Profile
      </h3>
      
      {isLoadingProfile && (
        <p className="text-center text-blue-200">Loading profile...</p>
      )}
      
      {!!profileError && (
        <div className="text-center text-red-300 mb-4">
          <p>Failed to load profile</p>
          <p className="text-sm opacity-75">
            {profileError && typeof profileError === 'object' && 'status' in profileError
              ? `Error ${(profileError as { status: number }).status}`
              : 'Network error'}
          </p>
        </div>
      )}
      
      {profile && (
        <div className="space-y-3 mb-6">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      )}
      
      <div className="space-y-3">
        <button
          onClick={testAuthCall}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
        >
          🔄 Test Auth API Call
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >
          🚪 Logout
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg">
        <p className="text-sm text-yellow-100">
          💡 <strong>Test Token Expiry:</strong> The Playwright tests verify that when an API call returns 403, the JWT token is automatically removed from localStorage, effectively logging you out.
        </p>
      </div>
    </div>
  )
}

export default AuthExample