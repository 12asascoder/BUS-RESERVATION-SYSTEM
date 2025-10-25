import React, { useState, useEffect } from 'react';
import { 
  CpuChipIcon,
  FireIcon,
  EyeIcon,
  BoltIcon,
  MapPinIcon,
  ClockIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface IoTData {
  id: string;
  busId: string;
  temperature: number;
  humidity: number;
  fuelLevel: number;
  speed: number;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
}

const IoTDashboard: React.FC = () => {
  const [iotData, setIotData] = useState<IoTData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string>('');

  useEffect(() => {
    fetchIoTData();
    const interval = setInterval(fetchIoTData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchIoTData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/iot/data`);
      if (response.ok) {
        const data = await response.json();
        setIotData(data);
        if (!selectedBus && data.length > 0) {
          setSelectedBus(data[0].busId);
        }
      }
    } catch (error) {
      console.error('Error fetching IoT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = selectedBus 
    ? iotData.filter(data => data.busId === selectedBus)
    : iotData;

  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'text-blue-600';
    if (temp > 30) return 'text-red-600';
    return 'text-green-600';
  };

  const getFuelColor = (fuel: number) => {
    if (fuel < 20) return 'text-red-600';
    if (fuel < 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">IoT Monitoring Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Real-time monitoring of bus sensors and environmental data
        </p>
      </div>

      {/* Bus Filter */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Bus:</label>
          <select
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Buses</option>
            {Array.from(new Set(iotData.map(data => data.busId))).map(busId => (
              <option key={busId} value={busId}>{busId}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <SignalIcon className="w-4 h-4 text-green-500" />
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* IoT Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((data) => (
          <div key={data.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CpuChipIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{data.busId}</h3>
                  <p className="text-sm text-gray-600">Sensor ID: {data.id}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-green-600">
                  <SignalIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Online</span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(data.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Sensor Data */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <FireIcon className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-xs text-gray-500">Temperature</p>
                    <p className={`text-sm font-medium ${getTemperatureColor(data.temperature)}`}>
                      {data.temperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <EyeIcon className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Humidity</p>
                    <p className="text-sm font-medium text-gray-900">
                      {data.humidity.toFixed(1)}%
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
                      className={`h-2 rounded-full transition-all duration-500 ${
                        data.fuelLevel < 20 ? 'bg-red-500' : 
                        data.fuelLevel < 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${data.fuelLevel}%` }}
                    ></div>
                  </div>
                  <p className={`text-xs mt-1 ${getFuelColor(data.fuelLevel)}`}>
                    {data.fuelLevel.toFixed(0)}% remaining
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500">Speed</p>
                  <p className="text-sm font-medium text-gray-900">
                    {data.speed.toFixed(0)} km/h
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Location:</span>
                  <span>
                    {data.location.latitude.toFixed(4)}, {data.location.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Sensors</p>
              <p className="text-2xl font-bold text-gray-900">{iotData.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Monitored Buses</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(iotData.map(data => data.busId)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FireIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Temperature</p>
              <p className="text-2xl font-bold text-gray-900">
                {(iotData.reduce((sum, data) => sum + data.temperature, 0) / iotData.length).toFixed(1)}°C
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BoltIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Fuel Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {(iotData.reduce((sum, data) => sum + data.fuelLevel, 0) / iotData.length).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Updates Notice */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <SignalIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Real-time IoT Monitoring</h3>
            <p className="text-green-800 mb-4">
              This dashboard provides live monitoring of bus sensors including temperature, humidity, 
              fuel levels, speed, and GPS location. Data updates every 5 seconds automatically.
            </p>
            <div className="flex items-center space-x-4 text-sm text-green-700">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>5s Refresh Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IoTDashboard;
