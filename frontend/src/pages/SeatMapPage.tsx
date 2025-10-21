import React, { useState } from 'react'
import { 
  Cog6ToothIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Seat {
  id: string
  number: string
  type: 'window' | 'aisle' | 'standard'
  status: 'available' | 'occupied' | 'selected' | 'maintenance'
  comfortScore: number
  price: number
}

const SeatMapPage: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)

  // Generate mock seat data
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const types: ('window' | 'aisle' | 'standard')[] = ['window', 'aisle', 'aisle', 'window']
    
    for (let row = 1; row <= 12; row++) {
      for (let col = 0; col < 4; col++) {
        const seatNumber = `${row}${String.fromCharCode(65 + col)}`
        const isOccupied = Math.random() > 0.7
        const isMaintenance = Math.random() > 0.95
        
        seats.push({
          id: seatNumber,
          number: seatNumber,
          type: types[col],
          status: isMaintenance ? 'maintenance' : isOccupied ? 'occupied' : 'available',
          comfortScore: 0.7 + Math.random() * 0.3,
          price: 45 + (col === 0 || col === 3 ? 5 : 0) // Window seats cost more
        })
      }
    }
    
    return seats
  }

  const seats = generateSeats()

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'available') {
      setSelectedSeats(prev => 
        prev.includes(seat.id) 
          ? prev.filter(id => id !== seat.id)
          : [...prev, seat.id]
      )
    }
  }

  const getSeatClasses = (seat: Seat) => {
    const baseClasses = "w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer transition-all duration-200"
    
    if (seat.status === 'occupied') {
      return `${baseClasses} seat-occupied`
    }
    
    if (seat.status === 'maintenance') {
      return `${baseClasses} seat-maintenance`
    }
    
    if (selectedSeats.includes(seat.id)) {
      return `${baseClasses} seat-selected`
    }
    
    if (hoveredSeat === seat.id) {
      return `${baseClasses} seat-available transform scale-105`
    }
    
    return `${baseClasses} seat-available`
  }

  const getSeatIcon = (seat: Seat) => {
    if (seat.status === 'occupied') return '👤'
    if (seat.status === 'maintenance') return '🔧'
    if (selectedSeats.includes(seat.id)) return '✓'
    return seat.number
  }

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find(s => s.id === seatId)
    return total + (seat?.price || 0)
  }, 0)

  const selectedSeatsData = selectedSeats.map(seatId => 
    seats.find(s => s.id === seatId)
  ).filter(Boolean) as Seat[]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Seat Selection</h1>
        <p className="text-gray-600">Choose your seats with real-time comfort and health monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bus Layout - FutureBus Pro FT-001</h2>
            
            {/* Driver Area */}
            <div className="text-center mb-6">
              <div className="w-16 h-8 bg-gray-300 rounded mx-auto flex items-center justify-center text-xs font-medium">
                Driver
              </div>
            </div>

            {/* Seat Grid */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={getSeatClasses(seat)}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={() => setHoveredSeat(seat.id)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  title={`${seat.number} - ${seat.type} - Comfort: ${(seat.comfortScore * 100).toFixed(0)}% - $${seat.price}`}
                >
                  {getSeatIcon(seat)}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span>Occupied</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Selection Summary</h2>
            
            {selectedSeats.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No seats selected</p>
            ) : (
              <div className="space-y-4">
                {selectedSeatsData.map((seat) => (
                  <div key={seat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Seat {seat.number}</p>
                      <p className="text-sm text-gray-600 capitalize">{seat.type} seat</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${seat.price}</p>
                      <p className="text-xs text-gray-500">
                        Comfort: {(seat.comfortScore * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">${totalPrice}</span>
                  </div>
                </div>
                
                <button className="w-full btn-primary py-3">
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>

          {/* Seat Features */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seat Features</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cog6ToothIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Smart Sensors</p>
                  <p className="text-sm text-gray-600">Real-time comfort monitoring</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Health Status</p>
                  <p className="text-sm text-gray-600">Automatic maintenance alerts</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dynamic Pricing</p>
                  <p className="text-sm text-gray-600">Prices adjust based on comfort</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Features */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bus Features</h2>
            <div className="space-y-2">
              {['WiFi', 'AC', 'USB Ports', 'Entertainment', 'RFID Boarding', 'IoT Sensors'].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatMapPage
