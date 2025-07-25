import React from 'react'
import { useLogout } from '@/hooks/useLogout'
import { useGetProfileQuery } from '@/store/apiSlice'
import { getGlobalLogoutFunction } from '@/utils/logoutService'
import axios, { AxiosError } from 'axios'

/**
 * Test component to verify logout dialog functionality
 */
const TestLogout: React.FC = () => {
  const { showLogoutDialog } = useLogout()
  const { refetch: refetchProfile } = useGetProfileQuery(undefined, { skip: true })

  const handleTestLogout = () => {
    showLogoutDialog('Test logout dialog - Your session has expired!')
  }

  const handleTest403Error = async () => {
    try {
      // First, set an invalid token to simulate expired session
      localStorage.setItem('jwt', 'invalid-expired-token')
      
      // Try to fetch profile with invalid token - this should trigger 403
      await refetchProfile()
      
    } catch (error) {
      const axiosError = error as AxiosError
      console.log('403 error triggered:', axiosError.response?.status)
      // The axios interceptor should handle the 403 error and show the dialog
    }
  }
  
  const handleTestAxios403 = async () => {
    try {
      // Alternative test using direct axios call
      localStorage.setItem('jwt', 'invalid-expired-token')
      await axios.get('/api/auth/profile')
    } catch (error) {
      const axiosError = error as AxiosError
      console.log('Axios 403 error triggered:', axiosError.response?.status)
    }
  }
  
  const handleTestGlobalLogout = () => {
    console.log('🔴 Testing global logout function directly')
    const globalLogout = getGlobalLogoutFunction()
    console.log('🔴 Global logout function:', globalLogout)
    if (globalLogout) {
      console.log('🔴 Calling global logout function')
      globalLogout('Direct test of global logout function')
    } else {
      console.log('🔴 No global logout function available')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Test Logout Functionality</h3>
      <div className="space-x-2">
        <button 
          onClick={handleTestLogout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Logout Dialog
        </button>
        <button 
          onClick={handleTest403Error}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Test 403 Error (RTK Query)
        </button>
        <button 
          onClick={handleTestAxios403}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Test 403 Error (Axios)
        </button>
        <button 
          onClick={handleTestGlobalLogout}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Test Global Logout Direct
        </button>
      </div>
    </div>
  )
}

export default TestLogout