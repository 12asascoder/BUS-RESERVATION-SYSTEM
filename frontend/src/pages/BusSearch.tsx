import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  MagnifyingGlassIcon,
  TruckIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Bus {
  id: string;
  name: string;
  operator: string;
  from: string;
  to: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  capacity: number;
  type: string;
  rating: number;
  availableSeats: number;
  occupancy: number;
}

const BusSearch: React.FC = () => {
  const { token } = useAuth();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    type: 'all'
  });

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Kochi'
  ];

  const busTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'AC Sleeper', label: 'AC Sleeper' },
    { value: 'AC Seater', label: 'AC Seater' },
    { value: 'Non-AC Sleeper', label: 'Non-AC Sleeper' },
    { value: 'Non-AC Seater', label: 'Non-AC Seater' }
  ];

  const searchBuses = async () => {
    if (!searchParams.from || !searchParams.to) {
      alert('Please select both departure and destination cities');
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        from: searchParams.from,
        to: searchParams.to,
        date: searchParams.date,
        ...(searchParams.type !== 'all' && { type: searchParams.type })
      });

      const response = await fetch(`${API_BASE_URL}/buses?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setBuses(data);
      } else {
        alert('Error fetching buses: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (bus: Bus) => {
    if (bus.availableSeats === 0) {
      alert('No seats available for this bus');
      return;
    }

    // For now, redirect to Java GUI for booking
    alert(`To book ${bus.name}:\n\n1. Launch Java GUI application\n2. Use the advanced booking system\n3. Select seats and complete payment\n\nOr use the web interface for basic booking.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search Buses</h1>
        <p className="text-gray-600 mt-2">
          Find and book your perfect bus journey with real-time availability.
        </p>
      </div>

      {/* Search Form */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              value={searchParams.from}
              onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select departure city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              value={searchParams.to}
              onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select destination city</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus Type
            </label>
            <select
              value={searchParams.type}
              onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {busTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={searchBuses}
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span>{loading ? 'Searching...' : 'Search Buses'}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {buses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Buses ({buses.length})
          </h2>
          
          {buses.map((bus) => (
            <div key={bus.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bus.name}</h3>
                      <p className="text-sm text-gray-600">{bus.operator}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{bus.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{bus.type}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{bus.price}</p>
                      <p className="text-sm text-gray-600">per seat</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bus.from}</p>
                        <p className="text-xs text-gray-600">Departure</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bus.to}</p>
                        <p className="text-xs text-gray-600">Destination</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bus.departureTime}</p>
                        <p className="text-xs text-gray-600">Departure</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{bus.arrivalTime}</p>
                        <p className="text-xs text-gray-600">Arrival</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {bus.availableSeats} seats available
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${bus.occupancy}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{bus.occupancy}% full</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6">
                  <button
                    onClick={() => handleBooking(bus)}
                    disabled={bus.availableSeats === 0}
                    className={`w-full lg:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                      bus.availableSeats === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {bus.availableSeats === 0 ? 'No Seats Available' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {buses.length === 0 && !loading && (
        <div className="card text-center py-12">
          <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or check back later for new routes.
          </p>
          <button
            onClick={searchBuses}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search Again
          </button>
        </div>
      )}

      {/* Java GUI Integration Notice */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TruckIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Booking Features</h3>
            <p className="text-blue-800 mb-4">
              For interactive seat selection, payment processing, and comprehensive booking management, 
              use our dedicated Java GUI application with production-ready features.
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
              <span className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium">
                Web Interface (Basic)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusSearch;
