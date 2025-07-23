import { useState, useEffect } from 'react'
import { useGetHealthCheckQuery } from './store/apiSlice'

/**
 * Main App component for the Church PWA
 * Demonstrates RTK Query usage and provides a church-themed interface
 */
function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { data, error, isLoading } = useGetHealthCheckQuery()

  // Listen for online/offline status changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col church-gradient text-white">
      <header className="glass-effect p-4 md:px-8 flex flex-col md:flex-row justify-between items-center shadow-lg">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0">🏛️ Church PWA</h1>
        <div className="flex items-center">
          <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isOnline 
              ? 'bg-green-500/20 border border-green-500/50 text-green-100' 
              : 'bg-red-500/20 border border-red-500/50 text-red-100'
          }`}>
            {isOnline ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">Welcome to Our Church Community</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
            Stay connected with our church family through this progressive web app.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          <div className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse" style={{animationDelay: '0s', animationDuration: '3s'}}>
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">📅 Events</h3>
            <p className="opacity-90 leading-relaxed">Stay updated with upcoming church events and activities.</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse" style={{animationDelay: '1s', animationDuration: '3s'}}>
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">🙏 Prayer Requests</h3>
            <p className="opacity-90 leading-relaxed">Share and pray for one another in our community.</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-pulse" style={{animationDelay: '2s', animationDuration: '3s'}}>
            <h3 className="text-xl md:text-2xl font-medium mb-4 text-white">📖 Sermons</h3>
            <p className="opacity-90 leading-relaxed">Access past sermons and spiritual resources.</p>
          </div>
        </section>

        <section className="glass-effect rounded-2xl p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-medium mb-4">API Status</h3>
          {isLoading && <p className="text-blue-200">Checking API status...</p>}
          {error && <p className="text-red-300 font-medium">API connection failed (offline mode)</p>}
          {data && <p className="text-green-300 font-medium">API Status: {data.status}</p>}
        </section>
      </main>

      <footer className="bg-black/20 p-4 text-center opacity-80">
        <p className="text-sm md:text-base">Built with React, TypeScript, RTK Query, Tailwind CSS & PWA support</p>
      </footer>
    </div>
  )
}

export default App
