import React, { useState, useEffect } from 'react'
import { useData } from '../contexts/DataContext'
import { useWebSocket } from '../contexts/WebSocketContext'
import { 
  IdentificationIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  UserIcon,
  TruckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface RFIDEvent {
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

interface BoardingStatus {
  busId: number
  busNumber: string
  totalPassengers: number
  boardedPassengers: number
  missedPassengers: number
  boardingPercentage: number
  lastUpdate: string
}

interface PassengerAlert {
  passengerId: number
  passengerName: string
  ticketId: string
  busNumber: string
  seatNumber: string
  alertType: string
  message: string
  alertTime: string
}

const RFIDBoardingPage: React.FC = () => {
  const { buses, selectedBus, setSelectedBus, rfidEvents, addRFIDEvent } = useData()
  const { isConnected } = useWebSocket()

  const [boardingStatus, setBoardingStatus] = useState<BoardingStatus | null>(null)
  const [alerts, setAlerts] = useState<PassengerAlert[]>([])
  const [scanResult, setScanResult] = useState<string | null>(null)

  useEffect(() => {
    // Update boarding status when selected bus changes
    if (selectedBus) {
      // Ensure occupancy doesn't exceed capacity
      const actualOccupancy = Math.min(selectedBus.occupancy, selectedBus.capacity)
      
      setBoardingStatus({
        busId: selectedBus.id,
        busNumber: selectedBus.busNumber,
        totalPassengers: selectedBus.capacity,
        boardedPassengers: actualOccupancy,
        missedPassengers: Math.max(0, selectedBus.capacity - actualOccupancy),
        boardingPercentage: (actualOccupancy / selectedBus.capacity) * 100,
        lastUpdate: new Date().toISOString()
      })
    }
  }, [selectedBus])

  const simulateRFIDScan = () => {
    if (!selectedBus) return
    
    const ticketId = `TICKET_${Math.floor(Math.random() * 1000)}`
    const isAtCapacity = selectedBus.occupancy >= selectedBus.capacity
    const success = Math.random() > 0.2 && !isAtCapacity // 80% success rate, but not if at capacity
    
    let resultMessage = ''
    if (isAtCapacity) {
      resultMessage = 'Bus at capacity - boarding denied!'
    } else if (success) {
      resultMessage = 'Boarding successful!'
    } else {
      resultMessage = 'Invalid ticket'
    }
    
    setScanResult(resultMessage)
    
    // Add to events using the data context
    const newEvent: RFIDEvent = {
      id: Date.now().toString(),
      busId: selectedBus.id,
      rfidReaderId: 'READER_SIM',
      ticketId,
      passengerId: Math.floor(Math.random() * 100),
      eventType: isAtCapacity ? 'CAPACITY_EXCEEDED' : (success ? 'BOARDING' : 'SCAN_FAILED'),
      eventTime: new Date().toISOString(),
      location: 'boarding_gate_sim',
      success
    }
    
    addRFIDEvent(newEvent)
    
    // Clear result after 3 seconds
    setTimeout(() => setScanResult(null), 3000)
  }

  const getEventIcon = (eventType: string, success: boolean) => {
    if (eventType === 'BOARDING' && success) return CheckCircleIcon
    if (eventType === 'SCAN_FAILED' || eventType === 'CAPACITY_EXCEEDED' || !success) return XCircleIcon
    return ClockIcon
  }

  const getEventColor = (eventType: string, success: boolean) => {
    if (eventType === 'BOARDING' && success) return 'text-green-600 bg-green-100'
    if (eventType === 'CAPACITY_EXCEEDED') return 'text-orange-600 bg-orange-100'
    if (eventType === 'SCAN_FAILED' || !success) return 'text-red-600 bg-red-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RFID Smart Boarding</h1>
          <p className="text-gray-600">Real-time boarding verification and passenger tracking</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedBus?.id || 1}
            onChange={(e) => {
              const bus = buses.find(b => b.id === Number(e.target.value))
              setSelectedBus(bus || null)
            }}
            className="input-field w-80 text-black"
          >
            {buses.map(bus => (
              <option key={bus.id} value={bus.id}>
                {bus.busName} - {bus.currentRoute}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Boarding Status */}
      {boardingStatus && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Bus</p>
                <p className="text-xl font-bold">{boardingStatus.busNumber}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Boarded</p>
                <p className="text-xl font-bold">{boardingStatus.boardedPassengers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">Missed</p>
                <p className="text-xl font-bold">{boardingStatus.missedPassengers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-xl font-bold text-gray-900">{boardingStatus.boardingPercentage.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {boardingStatus && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Boarding Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Boarding Progress</span>
              <span>{boardingStatus.boardedPassengers} / {boardingStatus.totalPassengers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${boardingStatus.boardingPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* RFID Scanner Simulation */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">RFID Scanner</h3>
        <div className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <IdentificationIcon className="h-16 w-16 text-gray-400" />
          </div>
          
          <button
            onClick={simulateRFIDScan}
            className="btn-primary px-8 py-3 text-lg"
          >
            Simulate RFID Scan
          </button>
          
          {scanResult && (
            <div className={`p-4 rounded-lg ${
              scanResult.includes('successful') 
                ? 'bg-green-50 border border-green-200 text-black' 
                : scanResult.includes('capacity')
                ? 'bg-orange-50 border border-orange-200 text-black'
                : 'bg-red-50 border border-red-200 text-black'
            }`}>
              <p className="font-medium">{scanResult}</p>
            </div>
          )}
          
          <p className="text-sm text-gray-500">
            Click the button to simulate an RFID ticket scan
          </p>
        </div>
      </div>

      {/* Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent RFID Events</h3>
          <div className="space-y-3">
            {rfidEvents.map((event) => {
              const Icon = getEventIcon(event.eventType, event.success)
              return (
                <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-lg ${getEventColor(event.eventType, event.success)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {event.eventType === 'BOARDING' ? 'Boarding' : 
                         event.eventType === 'CAPACITY_EXCEEDED' ? 'Capacity Exceeded' : 
                         'Scan Failed'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.eventTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Ticket: {event.ticketId} • Passenger: {event.passengerId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reader: {event.rfidReaderId} • Location: {event.location}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            {boardingStatus && boardingStatus.missedPassengers > 0 && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="p-1 bg-red-100 rounded mr-3">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Passengers Not Boarded</p>
                  <p className="text-xs text-black">
                    {boardingStatus.missedPassengers} passengers haven't boarded yet
                  </p>
                </div>
              </div>
            )}
            
            {boardingStatus && boardingStatus.boardingPercentage >= 100 && (
              <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="p-1 bg-orange-100 rounded mr-3">
                  <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Bus at Capacity</p>
                  <p className="text-xs text-black">
                    Bus is full ({boardingStatus.boardedPassengers}/{boardingStatus.totalPassengers}) - no more boarding allowed
                  </p>
                </div>
              </div>
            )}
            
            {boardingStatus && boardingStatus.boardingPercentage < 50 && boardingStatus.boardingPercentage < 100 && (
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="p-1 bg-yellow-100 rounded mr-3">
                  <ClockIcon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Low Boarding Rate</p>
                  <p className="text-xs text-black">
                    Only {boardingStatus.boardingPercentage.toFixed(0)}% of passengers have boarded
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="p-1 bg-green-100 rounded mr-3">
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-black">RFID System Online</p>
                <p className="text-xs text-black">
                  All RFID readers are functioning normally
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Boarding Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {rfidEvents.filter(e => e.success).length}
            </div>
            <div className="text-sm text-gray-600">Successful Scans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {rfidEvents.filter(e => !e.success).length}
            </div>
            <div className="text-sm text-gray-600">Failed Scans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {rfidEvents.length > 0 ? 
                ((rfidEvents.filter(e => e.success).length / rfidEvents.length) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RFIDBoardingPage
