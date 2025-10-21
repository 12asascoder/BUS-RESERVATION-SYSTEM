import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  HomeIcon, 
  UserIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  CpuChipIcon,
  IdentificationIcon,
  SparklesIcon,
  ChartBarIcon,
  BellIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Hide navbar on home page and auth pages
  const hideNavbar = location.pathname === '/' || 
                     location.pathname === '/login' || 
                     location.pathname === '/register'

  if (hideNavbar) {
    return (
      <div className="min-h-screen animated-bg">
        {children}
      </div>
    )
  }

  const navigation = user?.role === 'admin' ? [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Admin Booking', href: '/booking', icon: TruckIcon },
    { name: 'Seat Map', href: '/seat-map', icon: Cog6ToothIcon },
    { name: 'IoT Dashboard', href: '/iot-dashboard', icon: CpuChipIcon },
    { name: 'RFID Boarding', href: '/rfid-boarding', icon: IdentificationIcon },
    { name: 'AI Assistant', href: '/ai-assistant', icon: SparklesIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  ] : [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Book Journey', href: '/passenger-booking', icon: TruckIcon },
    { name: 'My Bookings', href: '/profile', icon: UserIcon },
    { name: 'Reviews', href: '/reviews', icon: StarIcon },
    { name: 'AI Assistant', href: '/ai-assistant', icon: SparklesIcon },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Header */}
      <header className="glass sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center floating shadow-2xl shadow-purple-500/50">
                <TruckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">SmartBus2+</h1>
                <p className="text-xs">Futuristic Bus System</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.href)
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                <BellIcon className="w-6 h-6" />
              </button>

              {/* User Profile */}
              {user ? (
                <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/50">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white">{user.firstName || user.username}</p>
                    <p className="text-xs text-gray-300">Premium User</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="lg:hidden glass mx-4 mt-4 rounded-lg">
        <nav className="flex space-x-1 p-2 overflow-x-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex-shrink-0 px-3 py-2 rounded-lg transition-all duration-300 flex flex-col items-center space-y-1 min-w-[80px] ${
                isActive(item.href)
                  ? 'bg-white/20 text-white'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium text-center">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="glass mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <TruckIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold gradient-text">SmartBus2+</h3>
              </div>
              <p className="mb-4">
                The world's first RFID & IoT-enabled Bus Reservation System with AI-driven insights, 
                real-time telematics, smart boarding, and sustainability analytics.
              </p>
              <div className="flex space-x-4">
                <div className="status-online"></div>
                <span className="text-sm text-gray-300">All Systems Operational</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>IoT Telemetry</li>
                <li>RFID Boarding</li>
                <li>AI Assistant</li>
                <li>Energy Analytics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Contact Support</li>
                <li>Status Page</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p>&copy; 2024 SmartBus2+. All rights reserved. Built with ❤️ for the future of transportation.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
