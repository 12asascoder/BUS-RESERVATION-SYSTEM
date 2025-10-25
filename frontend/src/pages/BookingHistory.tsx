import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  TruckIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  PrinterIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface Booking {
  id: string;
  busId: string;
  seats: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  bus: {
    name: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
  };
}

const BookingHistory: React.FC = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        alert('Booking cancelled successfully');
      } else {
        alert('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Network error. Please try again.');
    }
  };

  const printTicket = (booking: Booking) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bus Ticket - ${booking.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .ticket { border: 2px solid #333; padding: 20px; max-width: 400px; }
              .header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
              .details { margin-bottom: 10px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <div class="header">
                <h2>SmartBus2+</h2>
                <h3>Bus Ticket</h3>
              </div>
              <div class="details">
                <div class="label">Booking ID:</div>
                <div>${booking.id}</div>
              </div>
              <div class="details">
                <div class="label">Passenger:</div>
                <div>${booking.passengerName}</div>
              </div>
              <div class="details">
                <div class="label">Bus:</div>
                <div>${booking.bus.name}</div>
              </div>
              <div class="details">
                <div class="label">Route:</div>
                <div>${booking.bus.from} → ${booking.bus.to}</div>
              </div>
              <div class="details">
                <div class="label">Seats:</div>
                <div>${JSON.parse(booking.seats).join(', ')}</div>
              </div>
              <div class="details">
                <div class="label">Departure:</div>
                <div>${booking.bus.departureTime}</div>
              </div>
              <div class="details">
                <div class="label">Arrival:</div>
                <div>${booking.bus.arrivalTime}</div>
              </div>
              <div class="details">
                <div class="label">Total Price:</div>
                <div>₹${booking.totalPrice}</div>
              </div>
              <div class="details">
                <div class="label">Status:</div>
                <div>${booking.status}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
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
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">
          View and manage your bus bookings
        </p>
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{booking.bus.name}</h3>
                      <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{booking.totalPrice}</p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.bus.from}</p>
                        <p className="text-xs text-gray-600">From</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.bus.to}</p>
                        <p className="text-xs text-gray-600">To</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.bus.departureTime}</p>
                        <p className="text-xs text-gray-600">Departure</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{booking.bus.arrivalTime}</p>
                        <p className="text-xs text-gray-600">Arrival</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Seats:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {JSON.parse(booking.seats).join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-2">
                  <button
                    onClick={() => printTicket(booking)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <PrinterIcon className="w-4 h-4" />
                    <span>Print</span>
                  </button>
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <XMarkIcon className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <TruckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600 mb-6">
            You haven't made any bookings yet. Start your journey by searching for buses.
          </p>
          <a
            href="/search"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search Buses
          </a>
        </div>
      )}

      {/* Java GUI Integration Notice */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TruckIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Booking Management</h3>
            <p className="text-blue-800 mb-4">
              For comprehensive booking management, payment processing, and advanced features, 
              use our dedicated Java GUI application.
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

export default BookingHistory;
