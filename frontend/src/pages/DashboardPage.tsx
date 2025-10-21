import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { 
  TruckIcon, 
  CpuChipIcon, 
  IdentificationIcon, 
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  EyeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface Bus {
  id: number
  busNumber: string
  busName: string
  model: string
  capacity: number
  category: string
  currentRoute: string
  occupancy: number
  status: 'active' | 'maintenance' | 'idle'
}

interface DashboardStats {
  totalBuses: number
  activeRoutes: number
  todayPassengers: number
  iotSensors: number
}

interface RecentActivity {
  id: string
  type: string
  message: string
  timestamp: string
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { buses, selectedBus, setSelectedBus, systemStats, rfidEvents, lastUpdate } = useData()
  const { isConnected } = useWebSocket()
  const [activeTab, setActiveTab] = useState<'overview' | 'buses' | 'bus-map'>('overview')

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])

  useEffect(() => {
    // Convert RFID events to recent activity
    const activity = rfidEvents.slice(0, 10).map(event => ({
      id: event.id,
      type: event.eventType.toLowerCase(),
      message: event.success ? `Passenger boarded Bus ${event.busId}` : `Scan failed for Bus ${event.busId}`,
      timestamp: new Date(event.eventTime).toLocaleTimeString()
    }))
    setRecentActivity(activity)
  }, [rfidEvents])

  const quickActions = [
    {
      title: 'IoT Dashboard',
      description: 'Monitor real-time sensor data',
      icon: CpuChipIcon,
      href: '/iot-dashboard',
      color: 'bg-green-500'
    },
    {
      title: 'RFID Boarding',
      description: 'Smart boarding system',
      icon: IdentificationIcon,
      href: '/rfid-boarding',
      color: 'bg-purple-500'
    },
    {
      title: 'AI Assistant',
      description: 'Get personalized recommendations',
      icon: SparklesIcon,
      href: '/ai-assistant',
      color: 'bg-orange-500'
    },
    {
      title: 'Analytics',
      description: 'Energy optimization insights',
      icon: ChartBarIcon,
      href: '/analytics',
      color: 'bg-blue-500'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'rfid': return IdentificationIcon
      case 'iot': return CpuChipIcon
      case 'ai': return SparklesIcon
      case 'booking': return TruckIcon
      default: return ClockIcon
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'rfid': return 'text-blue-600 bg-blue-100'
      case 'iot': return 'text-green-600 bg-green-100'
      case 'ai': return 'text-purple-600 bg-purple-100'
      case 'booking': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-black'
      case 'maintenance': return 'bg-yellow-100 text-black'
      case 'idle': return 'bg-gray-100 text-black'
      default: return 'bg-gray-100 text-black'
    }
  }

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const renderBusMap = (bus: Bus) => {
    const seats = []
    const rows = Math.ceil(bus.capacity / 4) // 2+2 configuration
    
    for (let row = 1; row <= rows; row++) {
      for (let seat = 1; seat <= 4; seat++) {
        const seatNumber = (row - 1) * 4 + seat
        if (seatNumber > bus.capacity) break
        
        const isOccupied = seatNumber <= bus.occupancy
        const isWindow = seat === 1 || seat === 4
        const isAisle = seat === 2 || seat === 3
        
        seats.push(
          <div
            key={seatNumber}
            className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold ${
              isOccupied 
                ? 'bg-red-500 text-white border-red-600' 
                : 'bg-green-500 text-white border-green-600'
            } ${isWindow ? 'ml-2' : ''} ${isAisle ? 'mr-2' : ''}`}
            title={`Seat ${seatNumber} - ${isOccupied ? 'Occupied' : 'Available'}`}
          >
            {seatNumber}
          </div>
        )
      }
      if (row < rows) {
        seats.push(<div key={`aisle-${row}`} className="w-4 h-8"></div>)
      }
    }
    
    return (
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {seats}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100 text-lg">
          SmartBus2+ Admin Dashboard - Manage your fleet efficiently
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm">
            {isConnected ? 'Real-time connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('buses')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'buses' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Bus Fleet
        </button>
        <button
          onClick={() => setActiveTab('bus-map')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'bus-map' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Seat Map
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TruckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Total Buses</p>
                      <p className="text-2xl font-bold">{systemStats.totalBuses}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Active Routes</p>
                      <p className="text-2xl font-bold">{systemStats.activeRoutes}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Today's Passengers</p>
                      <p className="text-2xl font-bold">{systemStats.todayPassengers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <CpuChipIcon className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">IoT Sensors</p>
                      <p className="text-2xl font-bold">{systemStats.iotSensors}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {action.title}
                  </h3>
                  <p className="text-sm">
                    {action.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs">{activity.timestamp}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="card text-black">
              <h3 className="text-lg font-semibold mb-4 text-black">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">IoT Telemetry</span>
                  <span className="sensor-indicator sensor-good text-black">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">RFID Gateway</span>
                  <span className="sensor-indicator sensor-good text-black">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">AI Assistant</span>
                  <span className="sensor-indicator sensor-good text-black">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">Analytics Engine</span>
                  <span className="sensor-indicator sensor-warning text-black">Processing</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bus Fleet Tab */}
      {activeTab === 'buses' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Bus Fleet Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buses.map((bus) => (
              <div key={bus.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{bus.busName}</h3>
                    <p className="text-sm text-gray-600">{bus.busNumber} - {bus.model}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
                    {bus.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Route:</span>
                    <span className="font-medium">{bus.currentRoute}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Capacity:</span>
                    <span className="font-medium">{bus.capacity} seats</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Occupancy:</span>
                    <span className={`font-medium ${getOccupancyColor(bus.occupancy, bus.capacity)}`}>
                      {bus.occupancy}/{bus.capacity} ({Math.round((bus.occupancy/bus.capacity)*100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedBus(bus)
                      setActiveTab('bus-map')
                    }}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 inline mr-1" />
                    View Seats
                  </button>
                  <button className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors">
                    <UserGroupIcon className="h-4 w-4 inline mr-1" />
                    Passengers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bus Map Tab */}
      {activeTab === 'bus-map' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Seat Map</h2>
            {selectedBus && (
              <button
                onClick={() => setActiveTab('buses')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Back to Fleet
              </button>
            )}
          </div>
          
          {selectedBus ? (
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-2">{selectedBus.busName} ({selectedBus.busNumber})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Route:</span>
                    <p>{selectedBus.currentRoute}</p>
                  </div>
                  <div>
                    <span className="font-medium">Model:</span>
                    <p>{selectedBus.model}</p>
                  </div>
                  <div>
                    <span className="font-medium">Capacity:</span>
                    <p>{selectedBus.capacity} seats</p>
                  </div>
                  <div>
                    <span className="font-medium">Occupancy:</span>
                    <p className={getOccupancyColor(selectedBus.occupancy, selectedBus.capacity)}>
                      {selectedBus.occupancy}/{selectedBus.capacity} ({Math.round((selectedBus.occupancy/selectedBus.capacity)*100)}%)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Seat Layout</h4>
                <div className="mb-4 flex justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded border border-green-600"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
                    <span className="text-sm">Occupied</span>
                  </div>
                </div>
                {renderBusMap(selectedBus)}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bus Selected</h3>
              <p className="text-gray-500 mb-4">Please select a bus from the Bus Fleet tab to view its seat map.</p>
              <button
                onClick={() => setActiveTab('buses')}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Bus Fleet
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
