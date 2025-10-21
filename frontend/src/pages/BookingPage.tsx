import React from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const BookingPage: React.FC = () => {
  const { buses } = useData()
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Booking</h1>
        <p>Find and book your next journey with SmartBus2+</p>
      </div>

      {/* Search Form */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Search Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              From
            </label>
            <div className="relative">
              <MapPinIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <select className="input-field pl-10 text-black">
                <option>Select Origin</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
                <option>Chennai</option>
                <option>Kolkata</option>
                <option>Hyderabad</option>
                <option>Pune</option>
                <option>Ahmedabad</option>
                <option>Jaipur</option>
                <option>Lucknow</option>
                <option>Kanpur</option>
                <option>Nagpur</option>
                <option>Indore</option>
                <option>Thane</option>
                <option>Bhopal</option>
                <option>Visakhapatnam</option>
                <option>Pimpri-Chinchwad</option>
                <option>Patna</option>
                <option>Vadodara</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              To
            </label>
            <div className="relative">
              <MapPinIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <select className="input-field pl-10 text-black">
                <option>Select Destination</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
                <option>Chennai</option>
                <option>Kolkata</option>
                <option>Hyderabad</option>
                <option>Pune</option>
                <option>Ahmedabad</option>
                <option>Jaipur</option>
                <option>Lucknow</option>
                <option>Kanpur</option>
                <option>Nagpur</option>
                <option>Indore</option>
                <option>Thane</option>
                <option>Bhopal</option>
                <option>Visakhapatnam</option>
                <option>Pimpri-Chinchwad</option>
                <option>Patna</option>
                <option>Vadodara</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Departure Date
            </label>
            <div className="relative">
              <CalendarIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                className="input-field pl-10 text-black"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Routes */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Available Routes</h2>
        <div className="space-y-4">
          {buses.slice(0, 5).map((bus) => (
            <div key={bus.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">
                      {bus.route}
                    </h3>
                    <span className="sensor-indicator sensor-good">
                      {bus.busName}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>08:00 - 20:00</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span>12h 00m</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span className="font-semibold text-green-600">₹{bus.price}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {['WiFi', 'AC', 'USB Ports', 'Entertainment'].map((feature, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-black px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Link
                    to="/seat-map"
                    className="btn-primary"
                  >
                    Select Seats
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Why Choose SmartBus2+?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart Search</h3>
            <p className="text-sm">
              AI-powered route recommendations based on your preferences
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapPinIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-sm">
              Track your bus location and get live updates
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">RFID Boarding</h3>
            <p className="text-sm">
              Lightning-fast boarding with RFID-enabled tickets
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
