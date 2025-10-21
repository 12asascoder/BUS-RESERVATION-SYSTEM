import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  CheckCircleIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  TruckIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

interface BookingStep {
  id: number
  title: string
  completed: boolean
}

const PassengerBookingPage: React.FC = () => {
  const { user } = useAuth()
  const { searchBuses, getAvailableSeats, createBooking, bookings } = useData()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [searchFilters, setSearchFilters] = useState({
    sourceCity: '',
    destinationCity: '',
    travelDate: '',
    departureTime: '',
    busType: ''
  })
  const [availableBuses, setAvailableBuses] = useState<any[]>([])
  const [selectedBus, setSelectedBus] = useState<any>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengerDetails, setPassengerDetails] = useState({
    name: user?.firstName + ' ' + user?.lastName || '',
    email: user?.email || '',
    phone: '',
    age: 25,
    gender: 'male' as 'male' | 'female' | 'other'
  })
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [booking, setBooking] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Update passenger details when user changes
  useEffect(() => {
    if (user) {
      setPassengerDetails(prev => ({
        ...prev,
        name: user.firstName + ' ' + user.lastName,
        email: user.email
      }))
    }
  }, [user])

  const steps: BookingStep[] = [
    { id: 1, title: 'Search Buses', completed: currentStep > 1 },
    { id: 2, title: 'Select Bus', completed: currentStep > 2 },
    { id: 3, title: 'Choose Seats', completed: currentStep > 3 },
    { id: 4, title: 'Passenger Details', completed: currentStep > 4 },
    { id: 5, title: 'Payment', completed: currentStep > 5 },
    { id: 6, title: 'Confirmation', completed: currentStep > 6 }
  ]

  const indianCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
    'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ludhiana'
  ]

  const handleSearch = () => {
    if (!searchFilters.sourceCity || !searchFilters.destinationCity || !searchFilters.travelDate) {
      alert('Please fill all required fields')
      return
    }
    
    const buses = searchBuses(searchFilters)
    setAvailableBuses(buses)
    setCurrentStep(2)
  }

  const handleBusSelection = (bus: any) => {
    setSelectedBus(bus)
    setCurrentStep(3)
  }

  const handleSeatSelection = (seatNumber: string) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber))
    } else {
      setSelectedSeats([...selectedSeats, seatNumber])
    }
  }

  const handlePassengerDetails = () => {
    if (!passengerDetails.name || !passengerDetails.email || !passengerDetails.phone) {
      alert('Please fill all required passenger details')
      return
    }
    setCurrentStep(5)
  }

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const bookingData = {
        busId: selectedBus.busId,
        passengerName: passengerDetails.name,
        passengerEmail: user?.email || passengerDetails.email, // Use logged-in user's email
        passengerPhone: passengerDetails.phone,
        passengerAge: passengerDetails.age,
        passengerGender: passengerDetails.gender,
        seatNumber: selectedSeats.join(', '),
        route: `${searchFilters.sourceCity} → ${searchFilters.destinationCity}`,
        sourceCity: searchFilters.sourceCity,
        destinationCity: searchFilters.destinationCity,
        travelDate: searchFilters.travelDate,
        departureTime: selectedBus.departureTime,
        arrivalTime: selectedBus.arrivalTime,
        price: selectedBus.price * selectedSeats.length,
        paymentMethod: paymentMethod,
        boardingPoint: selectedBus.boardingPoints[0],
        droppingPoint: selectedBus.droppingPoints[0]
      }
      
      const newBooking = await createBooking(bookingData)
      setBooking(newBooking)
      setCurrentStep(6)
    } catch (error) {
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Search Buses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <div className="relative">
                  <MapPinIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <select 
                    className="input-field pl-10 text-black"
                    value={searchFilters.sourceCity}
                    onChange={(e) => setSearchFilters({...searchFilters, sourceCity: e.target.value})}
                  >
                    <option value="">Select Origin</option>
                    {indianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <div className="relative">
                  <MapPinIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <select 
                    className="input-field pl-10 text-black"
                    value={searchFilters.destinationCity}
                    onChange={(e) => setSearchFilters({...searchFilters, destinationCity: e.target.value})}
                  >
                    <option value="">Select Destination</option>
                    {indianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Travel Date</label>
                <div className="relative">
                  <CalendarIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="date" 
                    className="input-field pl-10 text-black"
                    value={searchFilters.travelDate}
                    onChange={(e) => setSearchFilters({...searchFilters, travelDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bus Type</label>
                <select 
                  className="input-field text-black"
                  value={searchFilters.busType}
                  onChange={(e) => setSearchFilters({...searchFilters, busType: e.target.value})}
                >
                  <option value="">Any Type</option>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Sleeper">Sleeper</option>
                  <option value="Seater">Seater</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleSearch}
              className="btn-primary mt-6 w-full py-3 text-lg"
            >
              <MagnifyingGlassIcon className="w-5 h-5 inline mr-2" />
              Search Buses
            </button>
          </div>
        )

      case 2:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Available Buses</h2>
            <div className="space-y-4">
              {availableBuses.map((bus) => (
                <div key={bus.busId} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{bus.busName}</h3>
                      <p className="text-gray-600">{bus.busNumber} • {bus.operator}</p>
                      <div className="flex items-center mt-2">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{bus.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{bus.price}</p>
                      <p className="text-sm text-gray-600">per seat</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{bus.departureTime}</p>
                        <p className="text-xs text-gray-600">Departure</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{bus.arrivalTime}</p>
                        <p className="text-xs text-gray-600">Arrival</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{bus.busType}</p>
                        <p className="text-xs text-gray-600">Type</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{bus.availableSeats}</p>
                        <p className="text-xs text-gray-600">Seats Available</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {bus.amenities.map((amenity: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-black text-xs rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleBusSelection(bus)}
                    className="btn-primary w-full"
                  >
                    Select Bus
                  </button>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Select Seats</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{selectedBus.busName}</h3>
              <p className="text-gray-600">{selectedBus.busNumber} • {selectedBus.departureTime} - {selectedBus.arrivalTime}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded border border-green-600"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded border border-blue-600"></div>
                  <span className="text-sm">Selected</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                {Array.from({ length: selectedBus.availableSeats + selectedBus.availableSeats }, (_, i) => {
                  const seatNumber = `S${i + 1}`
                  const isOccupied = i < selectedBus.availableSeats
                  const isSelected = selectedSeats.includes(seatNumber)
                  
                  return (
                    <button
                      key={i}
                      onClick={() => !isOccupied && handleSeatSelection(seatNumber)}
                      disabled={isOccupied}
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center text-xs font-bold ${
                        isOccupied 
                          ? 'bg-red-500 text-white border-red-600 cursor-not-allowed' 
                          : isSelected
                          ? 'bg-blue-500 text-white border-blue-600'
                          : 'bg-green-500 text-white border-green-600 hover:bg-green-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            </div>
            
            {selectedSeats.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2">Selected Seats: {selectedSeats.join(', ')}</h4>
                <p className="text-lg font-bold">Total Price: ₹{selectedBus.price * selectedSeats.length}</p>
              </div>
            )}
            
            <button 
              onClick={() => setCurrentStep(4)}
              disabled={selectedSeats.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Passenger Details
            </button>
          </div>
        )

      case 4:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <div className="relative">
                  <UserIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    className="input-field pl-10 text-black"
                    value={passengerDetails.name}
                    onChange={(e) => setPassengerDetails({...passengerDetails, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <div className="relative">
                  <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="email" 
                    className="input-field pl-10 text-black"
                    value={passengerDetails.email}
                    onChange={(e) => setPassengerDetails({...passengerDetails, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <div className="relative">
                  <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="tel" 
                    className="input-field pl-10 text-black"
                    value={passengerDetails.phone}
                    onChange={(e) => setPassengerDetails({...passengerDetails, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input 
                  type="number" 
                  className="input-field text-black"
                  value={passengerDetails.age}
                  onChange={(e) => setPassengerDetails({...passengerDetails, age: parseInt(e.target.value)})}
                  min="1" max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select 
                  className="input-field text-black"
                  value={passengerDetails.gender}
                  onChange={(e) => setPassengerDetails({...passengerDetails, gender: e.target.value as 'male' | 'female' | 'other'})}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button 
                onClick={() => setCurrentStep(3)}
                className="btn-secondary flex-1"
              >
                <ArrowLeftIcon className="w-4 h-4 inline mr-2" />
                Back to Seats
              </button>
              <button 
                onClick={handlePassengerDetails}
                className="btn-primary flex-1"
              >
                Continue to Payment
                <ArrowRightIcon className="w-4 h-4 inline ml-2" />
              </button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Payment</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-black">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Bus:</span>
                  <span className="text-black">{selectedBus.busName} ({selectedBus.busNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Route:</span>
                  <span className="text-black">{searchFilters.sourceCity} → {searchFilters.destinationCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Date:</span>
                  <span className="text-black">{searchFilters.travelDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Seats:</span>
                  <span className="text-black">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Passenger:</span>
                  <span className="text-black">{passengerDetails.name}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-black">Total Amount:</span>
                  <span className="text-black">₹{selectedBus.price * selectedSeats.length}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 border-2 rounded-lg text-center transition-colors ${
                      paymentMethod === method 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CreditCardIcon className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm font-medium">{method}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setCurrentStep(4)}
                className="btn-secondary flex-1"
              >
                <ArrowLeftIcon className="w-4 h-4 inline mr-2" />
                Back to Details
              </button>
              <button 
                onClick={handlePayment}
                disabled={isLoading}
                className="btn-primary flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹{selectedBus.price * selectedSeats.length}
                    <ArrowRightIcon className="w-4 h-4 inline ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your ticket has been booked successfully</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold mb-4 text-black">Ticket Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-black">PNR Number:</span>
                  <span className="font-mono text-black">{booking?.pnrNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Booking ID:</span>
                  <span className="font-mono text-black">{booking?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Bus:</span>
                  <span className="text-black">{selectedBus.busName} ({selectedBus.busNumber})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Route:</span>
                  <span className="text-black">{searchFilters.sourceCity} → {searchFilters.destinationCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Date:</span>
                  <span className="text-black">{searchFilters.travelDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Time:</span>
                  <span className="text-black">{selectedBus.departureTime} - {selectedBus.arrivalTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Seats:</span>
                  <span className="text-black">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Passenger:</span>
                  <span className="text-black">{passengerDetails.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Boarding Point:</span>
                  <span className="text-black">{selectedBus.boardingPoints[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-black">Amount Paid:</span>
                  <span className="font-bold text-black">₹{selectedBus.price * selectedSeats.length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-black mb-2">Important Instructions:</h4>
              <ul className="text-sm text-black space-y-1">
                <li>• Please arrive at the boarding point 15-30 minutes before departure</li>
                <li>• Carry a valid ID proof for verification</li>
                <li>• Show this ticket or PNR number to the conductor</li>
                <li>• Keep your phone charged for GPS tracking</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-black mb-2">✅ Booking Confirmed!</h4>
              <p className="text-sm text-black">
                Your booking has been added to "My Bookings" and you can view it anytime from your profile.
              </p>
            </div>
            
            <div className="flex space-x-4">
              <Link 
                to="/profile"
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <UserIcon className="w-4 h-4" />
                <span>View My Bookings</span>
              </Link>
              <button 
                onClick={() => {
                  setCurrentStep(1)
                  setSearchFilters({ sourceCity: '', destinationCity: '', travelDate: '', departureTime: '', busType: '' })
                  setSelectedBus(null)
                  setSelectedSeats([])
                  setBooking(null)
                }}
                className="btn-secondary flex-1"
              >
                Book Another Ticket
              </button>
              <button 
                onClick={() => window.print()}
                className="btn-primary flex-1"
              >
                Print Ticket
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">Book Your Journey</h1>
        <p className="text-xl text-gray-300 mb-6">Find and book your perfect bus journey with SmartBus2+</p>
        {user && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 mb-8">
            <p className="text-lg text-white">
              Welcome back, <span className="font-bold text-yellow-300">{user.firstName} {user.lastName}</span>! 
              Ready to start your journey?
            </p>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.id === currentStep 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step.completed ? <CheckCircleIcon className="h-5 w-5" /> : step.id}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.id === currentStep ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  step.completed ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  )
}

export default PassengerBookingPage
