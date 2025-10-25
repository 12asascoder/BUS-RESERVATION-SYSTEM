import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { WebSocketProvider } from './contexts/WebSocketContext'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BookingPage from './pages/BookingPage'
import SeatMapPage from './pages/SeatMapPage'
import IoTDashboardPage from './pages/IoTDashboardPage'
import RFIDBoardingPage from './pages/RFIDBoardingPage'
import AITravelAssistantPage from './pages/AITravelAssistantPage'
import PassengerBookingPage from './pages/PassengerBookingPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import ReviewPage from './pages/ReviewPage'
import LiveTrackingPage from './pages/LiveTrackingPage'

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <DataProvider>
          <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/passenger-booking" element={<PassengerBookingPage />} />
              <Route path="/seat-map" element={<SeatMapPage />} />
            <Route path="/iot-dashboard" element={<IoTDashboardPage />} />
            <Route path="/rfid-boarding" element={<RFIDBoardingPage />} />
            <Route path="/ai-assistant" element={<AITravelAssistantPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/live-tracking" element={<LiveTrackingPage />} />
          </Routes>
          </Layout>
        </DataProvider>
      </WebSocketProvider>
    </AuthProvider>
  )
}

export default App
