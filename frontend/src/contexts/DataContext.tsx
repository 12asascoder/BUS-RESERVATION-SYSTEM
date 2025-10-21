import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useWebSocket } from './WebSocketContext'

// Data interfaces
export interface Bus {
  id: number
  busNumber: string
  busName: string
  model: string
  capacity: number
  category: string
  currentRoute: string
  route?: string
  price?: number
  occupancy: number
  status: 'active' | 'maintenance' | 'idle'
  temperature?: number
  humidity?: number
  vibration?: number
  fuelLevel?: number
  lastUpdate?: string
}

export interface RFIDEvent {
  id: string
  busId: number
  rfidReaderId: string
  ticketId: string
  passengerId: number
  eventType: string
  eventTime: string
  location: string
  success: boolean
}

export interface IoTData {
  busId: number
  temperature: number
  humidity: number
  vibration: number
  seatPressure: number[]
  timestamp: string
}

export interface Review {
  id: string
  bookingId: string
  busId: number
  busNumber: string
  passengerEmail: string
  passengerName: string
  rating: number // 1-5 stars
  title: string
  comment: string
  comfortRating: number // 1-5
  cleanlinessRating: number // 1-5
  punctualityRating: number // 1-5
  driverRating: number // 1-5
  amenitiesRating: number // 1-5
  wouldRecommend: boolean
  reviewDate: string
  journeyDate: string
  route: string
  verified: boolean
}

export interface Booking {
  id: string
  busId: number
  passengerId: number
  passengerName: string
  passengerEmail: string
  passengerPhone: string
  passengerAge: number
  passengerGender: 'male' | 'female' | 'other'
  seatNumber: string
  route: string
  sourceCity: string
  destinationCity: string
  travelDate: string
  departureTime: string
  arrivalTime: string
  price: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  bookingTime: string
  pnrNumber: string
  boardingPoint: string
  droppingPoint: string
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed'
}

export interface SearchFilters {
  sourceCity: string
  destinationCity: string
  travelDate: string
  departureTime?: string
  busType?: string
  priceRange?: { min: number; max: number }
}

export interface AvailableBus {
  busId: number
  busNumber: string
  busName: string
  operator: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  availableSeats: number
  busType: 'AC' | 'Non-AC' | 'Sleeper' | 'Seater'
  amenities: string[]
  rating: number
  boardingPoints: string[]
  droppingPoints: string[]
}

export interface SystemStats {
  totalBuses: number
  activeRoutes: number
  todayPassengers: number
  iotSensors: number
  totalRevenue: number
  energyEfficiency: number
  greenScore: number
  totalBookings: number
  lastUpdate: string
}

interface DataContextType {
  // Bus data
  buses: Bus[]
  selectedBus: Bus | null
  setSelectedBus: (bus: Bus | null) => void
  
  // RFID data
  rfidEvents: RFIDEvent[]
  addRFIDEvent: (event: RFIDEvent) => void
  
  // IoT data
  iotData: IoTData[]
  updateIoTData: (data: IoTData) => void
  
  // Booking data
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  cancelBooking: (id: string) => void
  
  // Review data
  reviews: Review[]
  addReview: (review: Review) => void
  getUserReviews: (userEmail: string) => Review[]
  getBusReviews: (busId: number) => Review[]
  getAverageRating: (busId: number) => number
  
  // Search and booking flow
  searchBuses: (filters: SearchFilters) => AvailableBus[]
  getAvailableSeats: (busId: number) => string[]
  createBooking: (bookingData: Partial<Booking>) => Promise<Booking>
  getUserBookings: (userEmail: string) => Booking[]
  
  // System stats
  systemStats: SystemStats
  updateSystemStats: (stats: Partial<SystemStats>) => void
  
  // Real-time updates
  isConnected: boolean
  lastUpdate: string
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

interface DataProviderProps {
  children: ReactNode
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { subscribeToIoT, subscribeToRFID, isConnected } = useWebSocket()
  
  // Initialize with comprehensive bus data - at least 10 buses per route
  const [buses, setBuses] = useState<Bus[]>([
      // Mumbai → Delhi Route (10+ buses)
      {
        id: 1,
        busNumber: 'SB-001',
        busName: 'SmartBus Pro',
        model: 'Volvo B11R',
        capacity: 50,
        category: 'Premium',
        currentRoute: 'Mumbai → Delhi',
        route: 'Mumbai → Delhi',
        price: 3000,
        occupancy: 45,
        status: 'active' as const,
        temperature: 24.5,
        humidity: 45,
        vibration: 0.2,
        fuelLevel: 85,
        lastUpdate: new Date().toISOString()
      },
    {
      id: 2,
      busNumber: 'SB-002',
      busName: 'SmartBus Elite',
      model: 'Scania K360',
      capacity: 45,
      category: 'Luxury',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 38,
      status: 'active',
      temperature: 23.8,
      humidity: 42,
      vibration: 0.1,
      fuelLevel: 92,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 3,
      busNumber: 'SB-003',
      busName: 'SmartBus Express',
      model: 'Mercedes-Benz Tourismo',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 32,
      status: 'active',
      temperature: 25.2,
      humidity: 48,
      vibration: 0.3,
      fuelLevel: 78,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 4,
      busNumber: 'SB-004',
      busName: 'SmartBus Premium',
      model: 'Volvo B9R',
      capacity: 55,
      category: 'Premium',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 50,
      status: 'active',
      temperature: 24.1,
      humidity: 44,
      vibration: 0.15,
      fuelLevel: 88,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 5,
      busNumber: 'SB-005',
      busName: 'SmartBus Comfort',
      model: 'Ashok Leyland',
      capacity: 48,
      category: 'Standard',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 42,
      status: 'active',
      temperature: 26.0,
      humidity: 50,
      vibration: 0.4,
      fuelLevel: 75,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 6,
      busNumber: 'SB-006',
      busName: 'SmartBus Deluxe',
      model: 'Tata Marcopolo',
      capacity: 42,
      category: 'Luxury',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 35,
      status: 'active',
      temperature: 23.5,
      humidity: 41,
      vibration: 0.1,
      fuelLevel: 90,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 7,
      busNumber: 'SB-007',
      busName: 'SmartBus City',
      model: 'Mahindra Comfio',
      capacity: 35,
      category: 'Standard',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 28,
      status: 'active',
      temperature: 24.8,
      humidity: 46,
      vibration: 0.25,
      fuelLevel: 82,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 8,
      busNumber: 'SB-008',
      busName: 'SmartBus Intercity',
      model: 'Volvo B11R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 0,
      status: 'idle',
      temperature: 22.0,
      humidity: 40,
      vibration: 0.0,
      fuelLevel: 95,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 9,
      busNumber: 'SB-009',
      busName: 'SmartBus Long Haul',
      model: 'Scania K410',
      capacity: 60,
      category: 'Luxury',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 50,
      status: 'active',
      temperature: 20.0,
      humidity: 35,
      vibration: 0.0,
      fuelLevel: 100,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 10,
      busNumber: 'SB-010',
      busName: 'SmartBus Regional',
      model: 'Ashok Leyland',
      capacity: 45,
      category: 'Standard',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 40,
      status: 'active',
      temperature: 25.5,
      humidity: 49,
      vibration: 0.35,
      fuelLevel: 80,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 11,
      busNumber: 'SB-011',
      busName: 'SmartBus Metro',
      model: 'Eicher Skyline',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 30,
      status: 'active',
      temperature: 24.2,
      humidity: 47,
      vibration: 0.2,
      fuelLevel: 85,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 12,
      busNumber: 'SB-012',
      busName: 'SmartBus Connect',
      model: 'BharatBenz 1623C',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Mumbai → Delhi',
      occupancy: 45,
      status: 'active',
      temperature: 23.9,
      humidity: 43,
      vibration: 0.18,
      fuelLevel: 88,
      lastUpdate: new Date().toISOString()
    },

    // Bangalore → Chennai Route (10+ buses)
    {
      id: 13,
      busNumber: 'SB-013',
      busName: 'SmartBus Executive',
      model: 'Volvo 9400XL',
      capacity: 45,
      category: 'Luxury',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 38,
      status: 'active',
      temperature: 24.0,
      humidity: 44,
      vibration: 0.12,
      fuelLevel: 90,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 14,
      busNumber: 'SB-014',
      busName: 'Tata LPO 1618',
      model: 'Tata LPO 1618',
      capacity: 48,
      category: 'Standard',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 42,
      status: 'active',
      temperature: 25.1,
      humidity: 48,
      vibration: 0.3,
      fuelLevel: 78,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 15,
      busNumber: 'SB-015',
      busName: 'SmartBus Classic',
      model: 'Ashok Leyland Viking',
      capacity: 42,
      category: 'Standard',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 35,
      status: 'active',
      temperature: 24.7,
      humidity: 46,
      vibration: 0.25,
      fuelLevel: 82,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 16,
      busNumber: 'SB-016',
      busName: 'SmartBus Modern',
      model: 'Scania Metrolink',
      capacity: 50,
      category: 'Luxury',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 45,
      status: 'active',
      temperature: 23.6,
      humidity: 42,
      vibration: 0.15,
      fuelLevel: 87,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 17,
      busNumber: 'SB-017',
      busName: 'SmartBus Eco',
      model: 'Eicher 20.15',
      capacity: 38,
      category: 'Standard',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 30,
      status: 'active',
      temperature: 24.3,
      humidity: 45,
      vibration: 0.2,
      fuelLevel: 85,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 18,
      busNumber: 'SB-018',
      busName: 'SmartBus Plus',
      model: 'Volvo B8R',
      capacity: 45,
      category: 'Premium',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 40,
      status: 'active',
      temperature: 23.8,
      humidity: 43,
      vibration: 0.18,
      fuelLevel: 89,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 19,
      busNumber: 'SB-019',
      busName: 'SmartBus Max',
      model: 'Mercedes-Benz SHD 2436',
      capacity: 55,
      category: 'Luxury',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 50,
      status: 'active',
      temperature: 22.9,
      humidity: 41,
      vibration: 0.1,
      fuelLevel: 92,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 20,
      busNumber: 'SB-020',
      busName: 'SmartBus Prime',
      model: 'Ashok Leyland 12M',
      capacity: 50,
      category: 'Standard',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 44,
      status: 'active',
      temperature: 25.0,
      humidity: 49,
      vibration: 0.32,
      fuelLevel: 79,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 21,
      busNumber: 'SB-021',
      busName: 'SmartBus Ultra',
      model: 'Volvo B11R',
      capacity: 52,
      category: 'Premium',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 47,
      status: 'active',
      temperature: 24.1,
      humidity: 44,
      vibration: 0.16,
      fuelLevel: 86,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 22,
      busNumber: 'SB-022',
      busName: 'SmartBus Swift',
      model: 'Tata Starbus',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 32,
      status: 'active',
      temperature: 24.9,
      humidity: 47,
      vibration: 0.28,
      fuelLevel: 81,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 23,
      busNumber: 'SB-023',
      busName: 'SmartBus Royal',
      model: 'Scania K360',
      capacity: 48,
      category: 'Luxury',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 41,
      status: 'active',
      temperature: 23.4,
      humidity: 42,
      vibration: 0.13,
      fuelLevel: 91,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 24,
      busNumber: 'SB-024',
      busName: 'SmartBus Turbo',
      model: 'Ashok Leyland Cheetah',
      capacity: 46,
      category: 'Standard',
      currentRoute: 'Bangalore → Chennai',
      occupancy: 38,
      status: 'active',
      temperature: 25.3,
      humidity: 50,
      vibration: 0.35,
      fuelLevel: 77,
      lastUpdate: new Date().toISOString()
    },

    // Delhi → Jaipur Route (10+ buses)
    {
      id: 25,
      busNumber: 'SB-025',
      busName: 'SmartBus Heritage',
      model: 'Volvo B9R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 45,
      status: 'active',
      temperature: 24.2,
      humidity: 43,
      vibration: 0.17,
      fuelLevel: 88,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 26,
      busNumber: 'SB-026',
      busName: 'SmartBus Palace',
      model: 'Mercedes-Benz Tourismo',
      capacity: 44,
      category: 'Luxury',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 37,
      status: 'active',
      temperature: 23.7,
      humidity: 41,
      vibration: 0.11,
      fuelLevel: 93,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 27,
      busNumber: 'SB-027',
      busName: 'SmartBus Royal Express',
      model: 'Scania K410',
      capacity: 52,
      category: 'Luxury',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 48,
      status: 'active',
      temperature: 22.8,
      humidity: 39,
      vibration: 0.08,
      fuelLevel: 95,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 28,
      busNumber: 'SB-028',
      busName: 'SmartBus Pink City',
      model: 'Ashok Leyland',
      capacity: 48,
      category: 'Standard',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 42,
      status: 'active',
      temperature: 25.1,
      humidity: 47,
      vibration: 0.29,
      fuelLevel: 79,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 29,
      busNumber: 'SB-029',
      busName: 'SmartBus Fort',
      model: 'Tata Marcopolo',
      capacity: 46,
      category: 'Standard',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 39,
      status: 'active',
      temperature: 24.6,
      humidity: 45,
      vibration: 0.22,
      fuelLevel: 83,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 30,
      busNumber: 'SB-030',
      busName: 'SmartBus Amber',
      model: 'Volvo B11R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 44,
      status: 'active',
      temperature: 23.9,
      humidity: 42,
      vibration: 0.14,
      fuelLevel: 87,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 31,
      busNumber: 'SB-031',
      busName: 'SmartBus Hawa Mahal',
      model: 'Eicher Skyline',
      capacity: 42,
      category: 'Standard',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 35,
      status: 'active',
      temperature: 24.8,
      humidity: 46,
      vibration: 0.26,
      fuelLevel: 84,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 32,
      busNumber: 'SB-032',
      busName: 'SmartBus City Palace',
      model: 'BharatBenz 1623C',
      capacity: 48,
      category: 'Premium',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 41,
      status: 'active',
      temperature: 24.0,
      humidity: 43,
      vibration: 0.19,
      fuelLevel: 86,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 33,
      busNumber: 'SB-033',
      busName: 'SmartBus Jantar Mantar',
      model: 'Mahindra Comfio',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 33,
      status: 'active',
      temperature: 25.0,
      humidity: 48,
      vibration: 0.31,
      fuelLevel: 80,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 34,
      busNumber: 'SB-034',
      busName: 'SmartBus Nahargarh',
      model: 'Volvo B8R',
      capacity: 46,
      category: 'Premium',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 40,
      status: 'active',
      temperature: 23.5,
      humidity: 41,
      vibration: 0.12,
      fuelLevel: 89,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 35,
      busNumber: 'SB-035',
      busName: 'SmartBus Jal Mahal',
      model: 'Scania Metrolink',
      capacity: 50,
      category: 'Luxury',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 45,
      status: 'active',
      temperature: 23.2,
      humidity: 40,
      vibration: 0.09,
      fuelLevel: 94,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 36,
      busNumber: 'SB-036',
      busName: 'SmartBus Chokhi Dhani',
      model: 'Ashok Leyland Viking',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Delhi → Jaipur',
      occupancy: 36,
      status: 'active',
      temperature: 24.7,
      humidity: 46,
      vibration: 0.24,
      fuelLevel: 82,
      lastUpdate: new Date().toISOString()
    },

    // Mumbai → Pune Route (10+ buses)
    {
      id: 37,
      busNumber: 'SB-037',
      busName: 'SmartBus Expressway',
      model: 'Volvo B9R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Mumbai → Pune',
      occupancy: 45,
      status: 'active',
      temperature: 24.3,
      humidity: 44,
      vibration: 0.16,
      fuelLevel: 87,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 38,
      busNumber: 'SB-038',
      busName: 'SmartBus IT Express',
      model: 'Mercedes-Benz Tourismo',
      capacity: 46,
      category: 'Luxury',
      currentRoute: 'Mumbai → Pune',
      occupancy: 39,
      status: 'active',
      temperature: 23.8,
      humidity: 42,
      vibration: 0.13,
      fuelLevel: 91,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 39,
      busNumber: 'SB-039',
      busName: 'SmartBus Corporate',
      model: 'Scania K360',
      capacity: 48,
      category: 'Luxury',
      currentRoute: 'Mumbai → Pune',
      occupancy: 42,
      status: 'active',
      temperature: 23.4,
      humidity: 41,
      vibration: 0.10,
      fuelLevel: 93,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 40,
      busNumber: 'SB-040',
      busName: 'SmartBus Tech City',
      model: 'Ashok Leyland',
      capacity: 50,
      category: 'Standard',
      currentRoute: 'Mumbai → Pune',
      occupancy: 44,
      status: 'active',
      temperature: 25.2,
      humidity: 49,
      vibration: 0.33,
      fuelLevel: 78,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 41,
      busNumber: 'SB-041',
      busName: 'SmartBus Startup',
      model: 'Tata Marcopolo',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Mumbai → Pune',
      occupancy: 37,
      status: 'active',
      temperature: 24.9,
      humidity: 47,
      vibration: 0.27,
      fuelLevel: 81,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 42,
      busNumber: 'SB-042',
      busName: 'SmartBus Innovation',
      model: 'Volvo B11R',
      capacity: 52,
      category: 'Premium',
      currentRoute: 'Mumbai → Pune',
      occupancy: 47,
      status: 'active',
      temperature: 24.0,
      humidity: 43,
      vibration: 0.15,
      fuelLevel: 88,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 43,
      busNumber: 'SB-043',
      busName: 'SmartBus Digital',
      model: 'Eicher Skyline',
      capacity: 42,
      category: 'Standard',
      currentRoute: 'Mumbai → Pune',
      occupancy: 34,
      status: 'active',
      temperature: 24.6,
      humidity: 45,
      vibration: 0.21,
      fuelLevel: 85,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 44,
      busNumber: 'SB-044',
      busName: 'SmartBus Silicon',
      model: 'BharatBenz 1623C',
      capacity: 48,
      category: 'Premium',
      currentRoute: 'Mumbai → Pune',
      occupancy: 41,
      status: 'active',
      temperature: 23.9,
      humidity: 42,
      vibration: 0.18,
      fuelLevel: 86,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 45,
      busNumber: 'SB-045',
      busName: 'SmartBus Cyber',
      model: 'Mahindra Comfio',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Mumbai → Pune',
      occupancy: 32,
      status: 'active',
      temperature: 25.1,
      humidity: 48,
      vibration: 0.30,
      fuelLevel: 79,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 46,
      busNumber: 'SB-046',
      busName: 'SmartBus Cloud',
      model: 'Volvo B8R',
      capacity: 46,
      category: 'Premium',
      currentRoute: 'Mumbai → Pune',
      occupancy: 40,
      status: 'active',
      temperature: 23.6,
      humidity: 41,
      vibration: 0.11,
      fuelLevel: 90,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 47,
      busNumber: 'SB-047',
      busName: 'SmartBus Data',
      model: 'Scania Metrolink',
      capacity: 50,
      category: 'Luxury',
      currentRoute: 'Mumbai → Pune',
      occupancy: 45,
      status: 'active',
      temperature: 23.3,
      humidity: 40,
      vibration: 0.08,
      fuelLevel: 95,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 48,
      busNumber: 'SB-048',
      busName: 'SmartBus AI',
      model: 'Ashok Leyland Viking',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Mumbai → Pune',
      occupancy: 36,
      status: 'active',
      temperature: 24.8,
      humidity: 46,
      vibration: 0.25,
      fuelLevel: 83,
      lastUpdate: new Date().toISOString()
    },

    // Delhi → Chandigarh Route (10+ buses)
    {
      id: 49,
      busNumber: 'SB-049',
      busName: 'SmartBus Capital',
      model: 'Volvo B9R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 45,
      status: 'active',
      temperature: 24.1,
      humidity: 43,
      vibration: 0.14,
      fuelLevel: 88,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 50,
      busNumber: 'SB-050',
      busName: 'SmartBus Garden City',
      model: 'Mercedes-Benz Tourismo',
      capacity: 46,
      category: 'Luxury',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 39,
      status: 'active',
      temperature: 23.7,
      humidity: 41,
      vibration: 0.12,
      fuelLevel: 92,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 51,
      busNumber: 'SB-051',
      busName: 'SmartBus Rose Garden',
      model: 'Scania K360',
      capacity: 48,
      category: 'Luxury',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 42,
      status: 'active',
      temperature: 23.5,
      humidity: 40,
      vibration: 0.09,
      fuelLevel: 94,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 52,
      busNumber: 'SB-052',
      busName: 'SmartBus Rock Garden',
      model: 'Ashok Leyland',
      capacity: 50,
      category: 'Standard',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 44,
      status: 'active',
      temperature: 25.0,
      humidity: 48,
      vibration: 0.32,
      fuelLevel: 78,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 53,
      busNumber: 'SB-053',
      busName: 'SmartBus Sukhna',
      model: 'Tata Marcopolo',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 37,
      status: 'active',
      temperature: 24.7,
      humidity: 46,
      vibration: 0.26,
      fuelLevel: 82,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 54,
      busNumber: 'SB-054',
      busName: 'SmartBus Capitol',
      model: 'Volvo B11R',
      capacity: 52,
      category: 'Premium',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 47,
      status: 'active',
      temperature: 23.8,
      humidity: 42,
      vibration: 0.16,
      fuelLevel: 87,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 55,
      busNumber: 'SB-055',
      busName: 'SmartBus Sector 17',
      model: 'Eicher Skyline',
      capacity: 42,
      category: 'Standard',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 34,
      status: 'active',
      temperature: 24.5,
      humidity: 44,
      vibration: 0.20,
      fuelLevel: 85,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 56,
      busNumber: 'SB-056',
      busName: 'SmartBus Leisure Valley',
      model: 'BharatBenz 1623C',
      capacity: 48,
      category: 'Premium',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 41,
      status: 'active',
      temperature: 23.9,
      humidity: 42,
      vibration: 0.17,
      fuelLevel: 86,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 57,
      busNumber: 'SB-057',
      busName: 'SmartBus Elante',
      model: 'Mahindra Comfio',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 32,
      status: 'active',
      temperature: 24.9,
      humidity: 47,
      vibration: 0.29,
      fuelLevel: 80,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 58,
      busNumber: 'SB-058',
      busName: 'SmartBus High Street',
      model: 'Volvo B8R',
      capacity: 46,
      category: 'Premium',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 40,
      status: 'active',
      temperature: 23.6,
      humidity: 41,
      vibration: 0.10,
      fuelLevel: 89,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 59,
      busNumber: 'SB-059',
      busName: 'SmartBus IT Park',
      model: 'Scania Metrolink',
      capacity: 50,
      category: 'Luxury',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 45,
      status: 'active',
      temperature: 23.2,
      humidity: 39,
      vibration: 0.07,
      fuelLevel: 96,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 60,
      busNumber: 'SB-060',
      busName: 'SmartBus Tricity',
      model: 'Ashok Leyland Viking',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Delhi → Chandigarh',
      occupancy: 36,
      status: 'active',
      temperature: 24.6,
      humidity: 45,
      vibration: 0.23,
      fuelLevel: 84,
      lastUpdate: new Date().toISOString()
    },

    // Additional routes with 10+ buses each
    // Kolkata → Hyderabad Route (10+ buses)
    {
      id: 61,
      busNumber: 'SB-061',
      busName: 'SmartBus Heritage Express',
      model: 'Volvo B9R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 45,
      status: 'active',
      temperature: 24.2,
      humidity: 44,
      vibration: 0.15,
      fuelLevel: 87,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 62,
      busNumber: 'SB-062',
      busName: 'SmartBus Pearl City',
      model: 'Mercedes-Benz Tourismo',
      capacity: 46,
      category: 'Luxury',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 39,
      status: 'active',
      temperature: 23.8,
      humidity: 42,
      vibration: 0.11,
      fuelLevel: 91,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 63,
      busNumber: 'SB-063',
      busName: 'SmartBus Charminar',
      model: 'Scania K360',
      capacity: 48,
      category: 'Luxury',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 42,
      status: 'active',
      temperature: 23.4,
      humidity: 41,
      vibration: 0.08,
      fuelLevel: 93,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 64,
      busNumber: 'SB-064',
      busName: 'SmartBus Golconda',
      model: 'Ashok Leyland',
      capacity: 50,
      category: 'Standard',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 44,
      status: 'active',
      temperature: 25.1,
      humidity: 49,
      vibration: 0.31,
      fuelLevel: 78,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 65,
      busNumber: 'SB-065',
      busName: 'SmartBus City of Nizams',
      model: 'Tata Marcopolo',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 37,
      status: 'active',
      temperature: 24.8,
      humidity: 47,
      vibration: 0.25,
      fuelLevel: 81,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 66,
      busNumber: 'SB-066',
      busName: 'SmartBus Cyberabad',
      model: 'Volvo B11R',
      capacity: 52,
      category: 'Premium',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 47,
      status: 'active',
      temperature: 23.9,
      humidity: 43,
      vibration: 0.14,
      fuelLevel: 88,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 67,
      busNumber: 'SB-067',
      busName: 'SmartBus HITEC City',
      model: 'Eicher Skyline',
      capacity: 42,
      category: 'Standard',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 34,
      status: 'active',
      temperature: 24.4,
      humidity: 45,
      vibration: 0.19,
      fuelLevel: 85,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 68,
      busNumber: 'SB-068',
      busName: 'SmartBus Gachibowli',
      model: 'BharatBenz 1623C',
      capacity: 48,
      category: 'Premium',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 41,
      status: 'active',
      temperature: 23.7,
      humidity: 42,
      vibration: 0.16,
      fuelLevel: 86,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 69,
      busNumber: 'SB-069',
      busName: 'SmartBus Kondapur',
      model: 'Mahindra Comfio',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 32,
      status: 'active',
      temperature: 24.7,
      humidity: 46,
      vibration: 0.27,
      fuelLevel: 80,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 70,
      busNumber: 'SB-070',
      busName: 'SmartBus Madhapur',
      model: 'Volvo B8R',
      capacity: 46,
      category: 'Premium',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 40,
      status: 'active',
      temperature: 23.5,
      humidity: 41,
      vibration: 0.09,
      fuelLevel: 90,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 71,
      busNumber: 'SB-071',
      busName: 'SmartBus Jubilee Hills',
      model: 'Scania Metrolink',
      capacity: 50,
      category: 'Luxury',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 45,
      status: 'active',
      temperature: 23.1,
      humidity: 39,
      vibration: 0.06,
      fuelLevel: 97,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 72,
      busNumber: 'SB-072',
      busName: 'SmartBus Banjara Hills',
      model: 'Ashok Leyland Viking',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Kolkata → Hyderabad',
      occupancy: 36,
      status: 'active',
      temperature: 24.5,
      humidity: 44,
      vibration: 0.21,
      fuelLevel: 83,
      lastUpdate: new Date().toISOString()
    },

    // Chennai → Bangalore Route (10+ buses)
    {
      id: 73,
      busNumber: 'SB-073',
      busName: 'SmartBus Silicon Valley',
      model: 'Volvo B9R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 45,
      status: 'active',
      temperature: 24.0,
      humidity: 43,
      vibration: 0.13,
      fuelLevel: 88,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 74,
      busNumber: 'SB-074',
      busName: 'SmartBus Garden City Express',
      model: 'Mercedes-Benz Tourismo',
      capacity: 46,
      category: 'Luxury',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 39,
      status: 'active',
      temperature: 23.6,
      humidity: 41,
      vibration: 0.10,
      fuelLevel: 92,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 75,
      busNumber: 'SB-075',
      busName: 'SmartBus IT Capital',
      model: 'Scania K360',
      capacity: 48,
      category: 'Luxury',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 42,
      status: 'active',
      temperature: 23.3,
      humidity: 40,
      vibration: 0.07,
      fuelLevel: 94,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 76,
      busNumber: 'SB-076',
      busName: 'SmartBus Tech Hub',
      model: 'Ashok Leyland',
      capacity: 50,
      category: 'Standard',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 44,
      status: 'active',
      temperature: 24.9,
      humidity: 48,
      vibration: 0.30,
      fuelLevel: 79,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 77,
      busNumber: 'SB-077',
      busName: 'SmartBus Startup Express',
      model: 'Tata Marcopolo',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 37,
      status: 'active',
      temperature: 24.6,
      humidity: 46,
      vibration: 0.24,
      fuelLevel: 82,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 78,
      busNumber: 'SB-078',
      busName: 'SmartBus Innovation Hub',
      model: 'Volvo B11R',
      capacity: 52,
      category: 'Premium',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 47,
      status: 'active',
      temperature: 23.7,
      humidity: 42,
      vibration: 0.12,
      fuelLevel: 87,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 79,
      busNumber: 'SB-079',
      busName: 'SmartBus Digital City',
      model: 'Eicher Skyline',
      capacity: 42,
      category: 'Standard',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 34,
      status: 'active',
      temperature: 24.3,
      humidity: 44,
      vibration: 0.18,
      fuelLevel: 85,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 80,
      busNumber: 'SB-080',
      busName: 'SmartBus Electronic City',
      model: 'BharatBenz 1623C',
      capacity: 48,
      category: 'Premium',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 41,
      status: 'active',
      temperature: 23.8,
      humidity: 42,
      vibration: 0.15,
      fuelLevel: 86,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 81,
      busNumber: 'SB-081',
      busName: 'SmartBus Whitefield',
      model: 'Mahindra Comfio',
      capacity: 40,
      category: 'Standard',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 32,
      status: 'active',
      temperature: 24.8,
      humidity: 47,
      vibration: 0.26,
      fuelLevel: 81,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 82,
      busNumber: 'SB-082',
      busName: 'SmartBus Marathahalli',
      model: 'Volvo B8R',
      capacity: 46,
      category: 'Premium',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 40,
      status: 'active',
      temperature: 23.4,
      humidity: 41,
      vibration: 0.08,
      fuelLevel: 89,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 83,
      busNumber: 'SB-083',
      busName: 'SmartBus Koramangala',
      model: 'Scania Metrolink',
      capacity: 50,
      category: 'Luxury',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 45,
      status: 'active',
      temperature: 23.0,
      humidity: 39,
      vibration: 0.05,
      fuelLevel: 98,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 84,
      busNumber: 'SB-084',
      busName: 'SmartBus Indiranagar',
      model: 'Ashok Leyland Viking',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Chennai → Bangalore',
      occupancy: 36,
      status: 'active',
      temperature: 24.4,
      humidity: 43,
      vibration: 0.20,
      fuelLevel: 84,
      lastUpdate: new Date().toISOString()
    },

    // Additional maintenance and idle buses
    {
      id: 85,
      busNumber: 'SB-085',
      busName: 'SmartBus Maintenance',
      model: 'Volvo B9R',
      capacity: 50,
      category: 'Premium',
      currentRoute: 'Maintenance',
      occupancy: 0,
      status: 'maintenance',
      temperature: 20.0,
      humidity: 35,
      vibration: 0.0,
      fuelLevel: 100,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 86,
      busNumber: 'SB-086',
      busName: 'SmartBus Standby',
      model: 'Mercedes-Benz Tourismo',
      capacity: 46,
      category: 'Luxury',
      currentRoute: 'Standby',
      occupancy: 0,
      status: 'idle',
      temperature: 22.0,
      humidity: 40,
      vibration: 0.0,
      fuelLevel: 95,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 87,
      busNumber: 'SB-087',
      busName: 'SmartBus Reserve',
      model: 'Scania K360',
      capacity: 48,
      category: 'Luxury',
      currentRoute: 'Reserve',
      occupancy: 0,
      status: 'idle',
      temperature: 21.5,
      humidity: 38,
      vibration: 0.0,
      fuelLevel: 98,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 88,
      busNumber: 'SB-088',
      busName: 'SmartBus Backup',
      model: 'Ashok Leyland',
      capacity: 50,
      category: 'Standard',
      currentRoute: 'Backup',
      occupancy: 0,
      status: 'idle',
      temperature: 22.5,
      humidity: 42,
      vibration: 0.0,
      fuelLevel: 92,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 89,
      busNumber: 'SB-089',
      busName: 'SmartBus Emergency',
      model: 'Tata Marcopolo',
      capacity: 44,
      category: 'Standard',
      currentRoute: 'Emergency',
      occupancy: 0,
      status: 'idle',
      temperature: 21.0,
      humidity: 36,
      vibration: 0.0,
      fuelLevel: 100,
      lastUpdate: new Date().toISOString()
    },
    {
      id: 90,
      busNumber: 'SB-090',
      busName: 'SmartBus Spare',
      model: 'Volvo B11R',
      capacity: 52,
      category: 'Premium',
      currentRoute: 'Spare',
      occupancy: 0,
      status: 'idle',
      temperature: 20.5,
      humidity: 37,
      vibration: 0.0,
      fuelLevel: 99,
      lastUpdate: new Date().toISOString()
    }
  ])
  
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [rfidEvents, setRfidEvents] = useState<RFIDEvent[]>([])
  const [iotData, setIotData] = useState<IoTData[]>([])
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'BK12345678',
      busId: 1,
      passengerId: 1001,
      passengerName: 'John Doe',
      passengerEmail: 'john.doe@example.com',
      passengerPhone: '+91 9876543210',
      passengerAge: 28,
      passengerGender: 'male',
      seatNumber: 'S5, S6',
      route: 'Mumbai → Delhi',
      sourceCity: 'Mumbai',
      destinationCity: 'Delhi',
      travelDate: '2024-01-15',
      departureTime: '08:00',
      arrivalTime: '20:00',
      price: 2500,
      status: 'confirmed',
      bookingTime: '2024-01-10T10:30:00Z',
      pnrNumber: 'PNR12345678',
      boardingPoint: 'City Center',
      droppingPoint: 'City Center',
      paymentMethod: 'UPI',
      paymentStatus: 'completed'
    },
    {
      id: 'BK87654321',
      busId: 2,
      passengerId: 1002,
      passengerName: 'Jane Smith',
      passengerEmail: 'jane.smith@example.com',
      passengerPhone: '+91 9876543211',
      passengerAge: 25,
      passengerGender: 'female',
      seatNumber: 'S12',
      route: 'Bangalore → Chennai',
      sourceCity: 'Bangalore',
      destinationCity: 'Chennai',
      travelDate: '2024-01-20',
      departureTime: '09:00',
      arrivalTime: '15:00',
      price: 1200,
      status: 'confirmed',
      bookingTime: '2024-01-12T14:20:00Z',
      pnrNumber: 'PNR87654321',
      boardingPoint: 'Airport',
      droppingPoint: 'Railway Station',
      paymentMethod: 'Credit Card',
      paymentStatus: 'completed'
    }
  ])
  
  // Initialize reviews state with sample data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'RV12345678',
      bookingId: 'BK12345678',
      busId: 1,
      busNumber: 'SB-001',
      passengerEmail: 'john.doe@example.com',
      passengerName: 'John Doe',
      rating: 5,
      title: 'Excellent journey!',
      comment: 'Very comfortable bus with great amenities. Driver was professional and punctual. Highly recommended!',
      comfortRating: 5,
      cleanlinessRating: 5,
      punctualityRating: 5,
      driverRating: 5,
      amenitiesRating: 4,
      wouldRecommend: true,
      reviewDate: '2024-01-16',
      journeyDate: '2024-01-15',
      route: 'Mumbai → Delhi',
      verified: true
    },
    {
      id: 'RV87654321',
      bookingId: 'BK87654321',
      busId: 2,
      busNumber: 'SB-002',
      passengerEmail: 'jane.smith@example.com',
      passengerName: 'Jane Smith',
      rating: 4,
      title: 'Good experience overall',
      comment: 'Bus was clean and comfortable. Slight delay in departure but driver made up time. Good value for money.',
      comfortRating: 4,
      cleanlinessRating: 5,
      punctualityRating: 3,
      driverRating: 4,
      amenitiesRating: 4,
      wouldRecommend: true,
      reviewDate: '2024-01-17',
      journeyDate: '2024-01-16',
      route: 'Bangalore → Chennai',
      verified: true
    },
    {
      id: 'RV11223344',
      bookingId: 'BK11223344',
      busId: 3,
      busNumber: 'SB-003',
      passengerEmail: 'mike.wilson@example.com',
      passengerName: 'Mike Wilson',
      rating: 3,
      title: 'Average journey',
      comment: 'Bus was okay but could be cleaner. Driver was fine but not very friendly. Seat was comfortable.',
      comfortRating: 4,
      cleanlinessRating: 2,
      punctualityRating: 4,
      driverRating: 3,
      amenitiesRating: 3,
      wouldRecommend: false,
      reviewDate: '2024-01-18',
      journeyDate: '2024-01-17',
      route: 'Delhi → Jaipur',
      verified: true
    }
  ])
  
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalBuses: 90,
    activeRoutes: 8,
    todayPassengers: 1247,
    iotSensors: 500,
    totalRevenue: 2500000,
    energyEfficiency: 91.2,
    greenScore: 94.5,
    totalBookings: 1247,
    lastUpdate: new Date().toISOString()
  })
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString())

  // Update bus data
  const updateBus = (busId: number, updates: Partial<Bus>) => {
    setBuses(prev => prev.map(bus => 
      bus.id === busId 
        ? { ...bus, ...updates, lastUpdate: new Date().toISOString() }
        : bus
    ))
    
    // Update selected bus if it's the same bus
    if (selectedBus && selectedBus.id === busId) {
      setSelectedBus(prev => prev ? { ...prev, ...updates, lastUpdate: new Date().toISOString() } : null)
    }
    
    setLastUpdate(new Date().toISOString())
  }

  // Add RFID event
  const addRFIDEvent = (event: RFIDEvent) => {
    setRfidEvents(prev => [event, ...prev.slice(0, 49)]) // Keep last 50 events
    
    // Update bus occupancy if boarding successful
    if (event.success && event.eventType === 'BOARDING') {
      const bus = buses.find(b => b.id === event.busId)
      if (bus) {
        // Only allow boarding if bus is not at capacity
        if (bus.occupancy < bus.capacity) {
          updateBus(event.busId, { 
            occupancy: bus.occupancy + 1
          })
          
          // Update system stats
          setSystemStats(prev => ({
            ...prev,
            todayPassengers: prev.todayPassengers + 1
          }))
        } else {
          // Bus is at capacity - mark event as failed
          const capacityExceededEvent = {
            ...event,
            success: false,
            eventType: 'CAPACITY_EXCEEDED'
          }
          setRfidEvents(prev => [capacityExceededEvent, ...prev.slice(0, 49)])
        }
      }
    }
    
    setLastUpdate(new Date().toISOString())
  }

  // Update IoT data
  const updateIoTData = (data: IoTData) => {
    setIotData(prev => [data, ...prev.slice(0, 99)]) // Keep last 100 readings
    
    // Update bus with IoT data
    updateBus(data.busId, {
      temperature: data.temperature,
      humidity: data.humidity,
      vibration: data.vibration
    })
    
    setLastUpdate(new Date().toISOString())
  }

  // Add booking
  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev])
    
    // Update bus occupancy
    updateBus(booking.busId, { 
      occupancy: buses.find(b => b.id === booking.busId)?.occupancy ? 
        buses.find(b => b.id === booking.busId)!.occupancy + 1 : 1 
    })
    
    // Update system stats
    setSystemStats(prev => ({
      ...prev,
      todayPassengers: prev.todayPassengers + 1,
      totalRevenue: prev.totalRevenue + booking.price
    }))
    
    setLastUpdate(new Date().toISOString())
  }

  // Update booking
  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ))
    setLastUpdate(new Date().toISOString())
  }

  // Cancel booking
  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'cancelled' } : booking
    ))
    setLastUpdate(new Date().toISOString())
  }

  // Search buses based on filters
  const searchBuses = (filters: SearchFilters): AvailableBus[] => {
    return buses
      .filter(bus => {
        const route = bus.currentRoute.toLowerCase()
        const sourceMatch = route.includes(filters.sourceCity.toLowerCase())
        const destMatch = route.includes(filters.destinationCity.toLowerCase())
        return sourceMatch && destMatch && bus.status === 'active'
      })
      .map(bus => ({
        busId: bus.id,
        busNumber: bus.busNumber,
        busName: bus.busName,
        operator: 'SmartBus2+',
        departureTime: '08:00', // Mock time
        arrivalTime: '20:00', // Mock time
        duration: '12h 00m',
        price: Math.floor(Math.random() * 2000) + 500, // ₹500-2500
        availableSeats: bus.capacity - bus.occupancy,
        busType: bus.category === 'Luxury' ? 'AC' : bus.category === 'Premium' ? 'AC' : 'Non-AC',
        amenities: ['WiFi', 'Charging Point', 'Water Bottle', 'Blanket'],
        rating: 4.2 + Math.random() * 0.8,
        boardingPoints: ['City Center', 'Airport', 'Railway Station'],
        droppingPoints: ['City Center', 'Airport', 'Railway Station']
      }))
  }

  // Get available seats for a bus
  const getAvailableSeats = (busId: number): string[] => {
    const bus = buses.find(b => b.id === busId)
    if (!bus) return []
    
    const availableSeats = []
    for (let i = 1; i <= bus.capacity; i++) {
      if (i > bus.occupancy) {
        availableSeats.push(`S${i}`)
      }
    }
    return availableSeats
  }

  // Create a new booking
  const createBooking = async (bookingData: Partial<Booking>): Promise<Booking> => {
    const pnrNumber = `PNR${Date.now().toString().slice(-8)}`
    const bookingId = `BK${Date.now().toString().slice(-8)}`
    
    const newBooking: Booking = {
      id: bookingId,
      busId: bookingData.busId || 1,
      passengerId: bookingData.passengerId || Math.floor(Math.random() * 1000),
      passengerName: bookingData.passengerName || '',
      passengerEmail: bookingData.passengerEmail || '',
      passengerPhone: bookingData.passengerPhone || '',
      passengerAge: bookingData.passengerAge || 25,
      passengerGender: bookingData.passengerGender || 'male',
      seatNumber: bookingData.seatNumber || 'S1',
      route: bookingData.route || '',
      sourceCity: bookingData.sourceCity || '',
      destinationCity: bookingData.destinationCity || '',
      travelDate: bookingData.travelDate || new Date().toISOString().split('T')[0],
      departureTime: bookingData.departureTime || '08:00',
      arrivalTime: bookingData.arrivalTime || '20:00',
      price: bookingData.price || 1000,
      status: 'confirmed',
      bookingTime: new Date().toISOString(),
      pnrNumber,
      boardingPoint: bookingData.boardingPoint || 'City Center',
      droppingPoint: bookingData.droppingPoint || 'City Center',
      paymentMethod: bookingData.paymentMethod || 'UPI',
      paymentStatus: 'completed'
    }
    
    console.log('Creating booking for user:', newBooking.passengerEmail)
    addBooking(newBooking)
    console.log('Booking added to global state')
    return newBooking
  }

  // Get bookings for a specific user
  const getUserBookings = (userEmail: string): Booking[] => {
    return bookings.filter(booking => booking.passengerEmail === userEmail)
  }

  // Add a new review
  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev])
    setLastUpdate(new Date().toISOString())
  }

  // Get reviews for a specific user
  const getUserReviews = (userEmail: string): Review[] => {
    return reviews.filter(review => review.passengerEmail === userEmail)
  }

  // Get reviews for a specific bus
  const getBusReviews = (busId: number): Review[] => {
    return reviews.filter(review => review.busId === busId)
  }

  // Get average rating for a specific bus
  const getAverageRating = (busId: number): number => {
    const busReviews = getBusReviews(busId)
    if (busReviews.length === 0) return 0
    const totalRating = busReviews.reduce((sum, review) => sum + review.rating, 0)
    return totalRating / busReviews.length
  }

  // Update system stats
  const updateSystemStats = (stats: Partial<SystemStats>) => {
    setSystemStats(prev => ({ ...prev, ...stats }))
    setLastUpdate(new Date().toISOString())
  }

  // Enhanced real-time data updates with better synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toISOString()
      
      // Update bus occupancy and status with realistic patterns
      setBuses(prevBuses => prevBuses.map(bus => {
        if (bus.status === 'active') {
          // More realistic occupancy changes based on time
          const hour = new Date().getHours()
          const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)
          const occupancyChange = isPeakHour ? 
            Math.floor(Math.random() * 2) : // Peak: 0-1 increase
            Math.floor(Math.random() * 3) - 1 // Off-peak: -1, 0, or 1
          
          const newOccupancy = Math.max(0, Math.min(bus.capacity, bus.occupancy + occupancyChange))
          
          return {
            ...bus,
            occupancy: newOccupancy,
            lastUpdate: now,
            temperature: 20 + Math.random() * 15,
            humidity: 35 + Math.random() * 20,
            vibration: Math.random() * 0.5,
            fuelLevel: Math.max(10, bus.fuelLevel ? bus.fuelLevel - Math.random() * 0.1 : 85)
          }
        }
        return bus
      }))
      
      // Simulate IoT data updates for active buses
      buses.forEach(bus => {
        if (bus.status === 'active') {
          const temperature = 20 + Math.random() * 15
          const humidity = 35 + Math.random() * 20
          const vibration = Math.random() * 0.5
          
          updateIoTData({
            busId: bus.id,
            temperature,
            humidity,
            vibration,
            seatPressure: Array.from({ length: bus.capacity }, () => Math.random()),
            timestamp: now
          })
        }
      })
      
      // Enhanced RFID event simulation
      if (Math.random() < 0.15) { // 15% chance every interval
        const activeBuses = buses.filter(bus => bus.status === 'active')
        if (activeBuses.length > 0) {
          const randomBus = activeBuses[Math.floor(Math.random() * activeBuses.length)]
          const eventTypes = ['BOARDING', 'SCAN_FAILED', 'CAPACITY_EXCEEDED']
          const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
          
          addRFIDEvent({
            id: `EVT_${Date.now()}`,
            busId: randomBus.id,
            rfidReaderId: `READER_${randomBus.id}_${Math.floor(Math.random() * 3) + 1}`,
            ticketId: `TICKET_${Math.floor(Math.random() * 10000)}`,
            passengerId: Math.floor(Math.random() * 1000),
            eventType,
            eventTime: now,
            location: `boarding_gate_${randomBus.id}`,
            success: eventType === 'BOARDING'
          })
        }
      }
      
      // Update system statistics with realistic patterns
      setSystemStats(prev => ({
        ...prev,
        energyEfficiency: Math.min(95, Math.max(75, prev.energyEfficiency + (Math.random() - 0.5) * 0.5)),
        greenScore: Math.min(98, Math.max(80, prev.greenScore + (Math.random() - 0.5) * 0.3)),
        totalBookings: prev.totalBookings + (Math.random() < 0.1 ? 1 : 0),
        activeRoutes: buses.filter(bus => bus.status === 'active').length,
        lastUpdate: now
      }))
      
      // Update global timestamp for synchronization
      setLastUpdate(now)
      
    }, 3000) // Update every 3 seconds for more responsive updates

    return () => clearInterval(interval)
  }, [buses])

  // Subscribe to WebSocket events
  useEffect(() => {
    const unsubscribeIoT = subscribeToIoT((data: any) => {
      updateIoTData(data)
    })

    const unsubscribeRFID = subscribeToRFID((data: any) => {
      addRFIDEvent(data)
    })

    return () => {
      unsubscribeIoT()
      unsubscribeRFID()
    }
  }, [subscribeToIoT, subscribeToRFID])

  const value: DataContextType = {
    buses,
    selectedBus,
    setSelectedBus,
    rfidEvents,
    addRFIDEvent,
    iotData,
    updateIoTData,
    bookings,
    addBooking,
    updateBooking,
    cancelBooking,
    reviews,
    addReview,
    getUserReviews,
    getBusReviews,
    getAverageRating,
    searchBuses,
    getAvailableSeats,
    createBooking,
    getUserBookings,
    systemStats,
    updateSystemStats,
    isConnected,
    lastUpdate
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
