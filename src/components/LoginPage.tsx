import React, { useState } from 'react'
import { useLoginMutation } from '../store/apiSlice'
import { useAppDispatch } from '../store/hooks'
import { loginSuccess } from '../store/authSlice'

interface LoginPageProps {
  onLoginSuccess: () => void
}

/**
 * Login page component for user authentication
 * Handles user login and token storage
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [login, { isLoading, error }] = useLoginMutation()
  const dispatch = useAppDispatch()

  /**
   * Handle form submission for user login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      return
    }

    try {
      const result = await login({ email, password }).unwrap()
      localStorage.setItem('jwt', result.token)
      
      // Dispatch login success to Redux store
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }))
      
      onLoginSuccess()
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  /**
   * Handle demo login with predefined credentials
   */
  const handleDemoLogin = async () => {
    try {
      const result = await login({ 
        email: 'demo@church.com', 
        password: 'demo123' 
      }).unwrap()
      localStorage.setItem('jwt', result.token)
      
      // Dispatch login success to Redux store
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }))
      
      onLoginSuccess()
    } catch (err) {
      console.error('Demo login failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center church-gradient text-white p-4">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold mb-2">🏛️ Church PWA</h1>
          <h2 className="text-xl font-light opacity-90">Welcome Back</h2>
          <p className="text-sm opacity-75 mt-2">
            Sign in to access your church community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all pr-12"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {!!error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm">
                {error && typeof error === 'object' && 'data' in error
                  ? (error.data as { message?: string })?.message || 'Login failed'
                  : 'Login failed. Please check your credentials.'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="mt-4 w-full py-3 px-4 bg-church-green hover:bg-church-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-church-green focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {isLoading ? 'Loading...' : '🚀 Try Demo Login'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-white/60">
            Demo credentials: demo@church.com / demo123
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage