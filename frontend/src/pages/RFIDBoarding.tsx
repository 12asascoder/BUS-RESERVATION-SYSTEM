import React, { useState, useEffect } from 'react';
import { 
  IdentificationIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface RFIDEvent {
  id: string;
  busId: string;
  passengerId: string;
  eventType: 'BOARDING' | 'ALIGHTING' | 'CAPACITY_EXCEEDED';
  timestamp: string;
  location: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

const RFIDBoarding: React.FC = () => {
  const [events, setEvents] = useState<RFIDEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string>('');

  useEffect(() => {
    fetchRFIDEvents();
    const interval = setInterval(fetchRFIDEvents, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRFIDEvents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rfid/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        if (!selectedBus && data.length > 0) {
          setSelectedBus(data[0].busId);
        }
      }
    } catch (error) {
      console.error('Error fetching RFID events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = selectedBus 
    ? events.filter(event => event.busId === selectedBus)
    : events;

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'BOARDING':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'ALIGHTING':
        return <XCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'CAPACITY_EXCEEDED':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <IdentificationIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'BOARDING':
        return 'text-green-600';
      case 'ALIGHTING':
        return 'text-blue-600';
      case 'CAPACITY_EXCEEDED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
        <h1 className="text-3xl font-bold text-gray-900">RFID Boarding System</h1>
        <p className="text-gray-600 mt-2">
          Real-time monitoring of passenger boarding and alighting events
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
            {Array.from(new Set(events.map(event => event.busId))).map(busId => (
              <option key={busId} value={busId}>{busId}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Events ({filteredEvents.length})
        </h2>
        
        {filteredEvents.length > 0 ? (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getEventIcon(event.eventType)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {event.eventType.replace('_', ' ')}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <IdentificationIcon className="w-4 h-4" />
                          <span>Bus: {event.busId}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>Passenger: {event.passengerId}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getEventTypeColor(event.eventType)}`}>
                      {event.eventType === 'BOARDING' ? 'Boarding' : 
                       event.eventType === 'ALIGHTING' ? 'Alighting' : 
                       'Capacity Exceeded'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <IdentificationIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No RFID events found</h3>
            <p className="text-gray-600">
              No boarding events detected for the selected bus.
            </p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Boardings</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.eventType === 'BOARDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Alightings</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.eventType === 'ALIGHTING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Capacity Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.eventType === 'CAPACITY_EXCEEDED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <IdentificationIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Buses</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(events.map(e => e.busId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IdentificationIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">RFID Boarding System</h3>
            <p className="text-blue-800 mb-4">
              This system monitors passenger boarding and alighting events using RFID technology. 
              It tracks capacity, identifies passengers, and provides real-time alerts for any issues.
            </p>
            <div className="flex items-center space-x-4 text-sm text-blue-700">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <ClockIcon className="w-4 h-4" />
                <span>3s Refresh Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFIDBoarding;
