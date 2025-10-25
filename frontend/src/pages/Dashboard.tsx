import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChartBarIcon,
  TruckIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  MapPinIcon,
  CpuChipIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
  totalUsers: number;
  totalBuses: number;
  totalBookings: number;
  totalRevenue: number;
}

interface RecentBooking {
  id: string;
  busId: string;
  seats: string[];
  totalPrice: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  bus: {
    name: string;
    from: string;
    to: string;
  };
}

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

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [iotData, setIotData] = useState<IoTData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch admin stats if user is admin
      if (user?.role === 'admin') {
        const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      }

      // Fetch user's bookings
      const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`, { headers });
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setRecentBookings(bookingsData.slice(0, 5)); // Show only recent 5
      }

      // Fetch IoT data
      const iotResponse = await fetch(`${API_BASE_URL}/iot/data`);
      if (iotResponse.ok) {
        const iotData = await iotResponse.json();
        setIotData(iotData.slice(0, 10)); // Show only first 10
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your SmartBus2+ system today.
        </p>
      </div>

      {/* Stats Cards */}
      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TruckIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBuses}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
            <a href="/bookings" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </a>
          </div>
          
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TruckIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.bus.name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.bus.from} → {booking.bus.to}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{booking.totalPrice}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No bookings yet</p>
              <a href="/search" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Start booking now
              </a>
            </div>
          )}
        </div>

        {/* IoT Monitoring */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">IoT Monitoring</h2>
            <a href="/iot-dashboard" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Details
            </a>
          </div>
          
          <div className="space-y-4">
            {iotData.slice(0, 5).map((data) => (
              <div key={data.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CpuChipIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{data.busId}</p>
                    <p className="text-sm text-gray-600">
                      Temp: {data.temperature.toFixed(1)}°C | Fuel: {data.fuelLevel.toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {data.speed.toFixed(0)} km/h
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/search" className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Book Bus</p>
              <p className="text-sm text-blue-700">Search and book</p>
            </div>
          </a>

          <a href="/iot-dashboard" className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">IoT Dashboard</p>
              <p className="text-sm text-green-700">Monitor sensors</p>
            </div>
          </a>

          <a href="/rfid-boarding" className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <IdentificationIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-purple-900">RFID Boarding</p>
              <p className="text-sm text-purple-700">Manage boarding</p>
            </div>
          </a>

          <a href="/ai-assistant" className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="font-medium text-yellow-900">AI Assistant</p>
              <p className="text-sm text-yellow-700">Get help</p>
            </div>
          </a>
        </div>
      </div>

      {/* Java GUI Integration */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TruckIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Booking System</h3>
            <p className="text-blue-800 mb-4">
              For advanced booking features including interactive seat selection, payment processing, 
              and comprehensive booking management, use our dedicated Java GUI application.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  alert('To launch Java GUI:\n\n1. Open Terminal/Command Prompt\n2. Navigate to project directory\n3. Run: ./run-java-gui.sh\n\nOr manually:\ncd java-gui && javac SmartBusBookingGUI.java && java SmartBusBookingGUI');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Launch Java GUI
              </button>
              <a 
                href="/search" 
                className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Use Web Interface
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
