import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { 
  CpuChipIcon, 
  FireIcon, 
  CloudIcon, 
  SpeakerWaveIcon,
  BoltIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface IoTData {
  busId: number
  temperature: number
  humidity: number
  vibration: number
  seatPressure: number[]
  timestamp: string
  noiseLevel?: number
  speed?: number
  comfortScore?: number
}

interface SeatOccupancy {
  busId: number
  seatNumber: string
  occupied: boolean
  pressureValue: number
  timestamp: string
}

const IoTDashboardPage: React.FC = () => {
  const { buses, selectedBus, setSelectedBus, iotData } = useData()
  const { isConnected } = useWebSocket()
  const [seatOccupancy, setSeatOccupancy] = useState<SeatOccupancy[]>([])
  const [realTimeData, setRealTimeData] = useState<IoTData | null>(null)

  useEffect(() => {
    // Get real-time data for selected bus
    const latestData = iotData.find(data => data.busId === selectedBus?.id)
    if (latestData) {
      // Add missing properties for display
      const displayData = {
        ...latestData,
        noiseLevel: 50 + Math.random() * 30,
        speed: Math.random() * 100,
        comfortScore: 0.7 + Math.random() * 0.3
      }
      setRealTimeData(displayData)
    }
    
    // Generate seat occupancy data
    const mockSeats: SeatOccupancy[] = []
    const busCapacity = selectedBus?.capacity || 50
    const rows = Math.ceil(busCapacity / 4)
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < 4; col++) {
        const seatNumber = `${row}${String.fromCharCode(65 + col)}`
        if ((row - 1) * 4 + col < busCapacity) {
          mockSeats.push({
            busId: selectedBus?.id || 1,
            seatNumber,
            occupied: Math.random() > 0.6,
            pressureValue: Math.random() * 100,
            timestamp: new Date().toISOString()
          })
        }
      }
    }
    setSeatOccupancy(mockSeats)
  }, [iotData, selectedBus])

  const getSensorStatus = (value: number, thresholds: { good: number, warning: number }) => {
    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.warning) return 'warning'
    return 'danger'
  }

  const getSensorColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'danger': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const occupiedSeats = seatOccupancy.filter(seat => seat.occupied).length
  const totalSeats = seatOccupancy.length
  const occupancyRate = (occupiedSeats / totalSeats) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IoT Dashboard</h1>
          <p className="text-gray-600">Real-time sensor monitoring and analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedBus?.id || 1}
            onChange={(e) => {
              const bus = buses.find(b => b.id === Number(e.target.value))
              setSelectedBus(bus || null)
            }}
            className="input-field w-64 text-black"
          >
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.busName} ({bus.busNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Status Cards */}
      {realTimeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Temperature</p>
                <p className="text-2xl font-bold">
                  {realTimeData.temperature.toFixed(1)}°C
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getSensorColor(getSensorStatus(realTimeData.temperature, { good: 25, warning: 30 }))}`}>
                <FireIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Humidity</p>
                <p className="text-2xl font-bold">
                  {realTimeData.humidity.toFixed(1)}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getSensorColor(getSensorStatus(realTimeData.humidity, { good: 60, warning: 80 }))}`}>
                <CloudIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Noise Level</p>
                <p className="text-2xl font-bold">
                  {realTimeData.noiseLevel.toFixed(0)} dB
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getSensorColor(getSensorStatus(realTimeData.noiseLevel, { good: 60, warning: 80 }))}`}>
                <SpeakerWaveIcon className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comfort Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(realTimeData.comfortScore * 100).toFixed(0)}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${getSensorColor(getSensorStatus(realTimeData.comfortScore * 100, { good: 80, warning: 60 }))}`}>
                <EyeIcon className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature & Humidity Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={iotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}${name === 'temperature' ? '°C' : '%'}`, name]}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="temperature"
              />
              <Line 
                type="monotone" 
                dataKey="humidity" 
                stroke="#10B981" 
                strokeWidth={2}
                name="humidity"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Speed & Vibration</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={iotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}${name === 'speed' ? ' km/h' : ' m/s²'}`, name]}
              />
              <Line 
                type="monotone" 
                dataKey="speed" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="speed"
              />
              <Line 
                type="monotone" 
                dataKey="vibration" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="vibration"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seat Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Occupancy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Occupied Seats</span>
              <span className="text-2xl font-bold text-gray-900">{occupiedSeats}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Seats</span>
              <span className="text-2xl font-bold text-gray-900">{totalSeats}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Occupancy Rate</span>
              <span className="text-2xl font-bold text-gray-900">{occupancyRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Seat Map</h3>
          <div className="grid grid-cols-4 gap-2">
            {seatOccupancy.map((seat, index) => (
              <div
                key={index}
                className={`p-2 text-xs text-center rounded border-2 transition-colors ${
                  seat.occupied 
                    ? 'seat-occupied' 
                    : 'seat-available'
                }`}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
              Available
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
              Occupied
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          {realTimeData && realTimeData.temperature > 30 && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="p-1 bg-red-100 rounded mr-3">
                <FireIcon className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-800">High Temperature Alert</p>
                <p className="text-xs text-red-600">Temperature exceeds safe threshold</p>
              </div>
            </div>
          )}
          
          {realTimeData && realTimeData.noiseLevel > 80 && (
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="p-1 bg-yellow-100 rounded mr-3">
                <SpeakerWaveIcon className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">High Noise Level</p>
                <p className="text-xs text-yellow-600">Noise level may affect passenger comfort</p>
              </div>
            </div>
          )}

          {realTimeData && realTimeData.comfortScore < 0.6 && (
            <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="p-1 bg-orange-100 rounded mr-3">
                <EyeIcon className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">Low Comfort Score</p>
                <p className="text-xs text-orange-600">Environmental conditions affecting comfort</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IoTDashboardPage
