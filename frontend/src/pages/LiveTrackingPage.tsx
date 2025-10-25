import React from 'react'
import { useData } from '../contexts/DataContext'
import { 
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  CpuChipIcon,
  SignalIcon,
  BoltIcon,
  FireIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const LiveTrackingPage: React.FC = () => {
  const { buses, iotData } = useData()

  const activeBuses = buses.filter(bus => bus.status === 'active')

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Bus Tracking</h1>
        <p className="text-gray-600">Real-time monitoring of all active buses with IoT sensors</p>
      </div>

      {/* Live Bus Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeBuses.slice(0, 12).map((bus) => {
          const busIoTData = iotData.find(data => data.busId === bus.id)
          
          return (
            <div key={bus.id} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{bus.busName}</h3>
                  <p className="text-sm text-gray-600">{bus.busNumber}</p>
                  <p className="text-sm text-blue-600 font-medium">{bus.currentRoute}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600">
                    <SignalIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Online</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {bus.occupancy}/{bus.capacity} passengers
                  </p>
                </div>
              </div>

              {/* IoT Sensor Data */}
              {busIoTData && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <FireIcon className="w-4 h-4 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Temperature</p>
                        <p className="text-sm font-medium text-gray-900">
                          {busIoTData.temperature.toFixed(1)}°C
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <EyeIcon className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-500">Humidity</p>
                        <p className="text-sm font-medium text-gray-900">
                          {busIoTData.humidity.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <BoltIcon className="w-4 h-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Fuel Level</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${bus.fuelLevel || 85}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {bus.fuelLevel || 85}% remaining
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bus Status */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TruckIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Status</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Last Update</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {bus.lastUpdate ? new Date(bus.lastUpdate).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Buses</p>
              <p className="text-2xl font-bold text-gray-900">{activeBuses.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">IoT Sensors</p>
              <p className="text-2xl font-bold text-gray-900">{iotData.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Routes Covered</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(buses.map(bus => bus.currentRoute)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TruckIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Booking Information</h3>
            <p className="text-blue-800 mb-3">
              For booking tickets and seat selection, please use our dedicated Java Booking GUI application.
            </p>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">To access Java Booking GUI:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Navigate to the Java Booking GUI section in the menu</li>
                <li>Launch the Java application separately</li>
                <li>Use the GUI for all booking and seat selection operations</li>
                <li>This web interface focuses on live tracking and monitoring</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveTrackingPage
