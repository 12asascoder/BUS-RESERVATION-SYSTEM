import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BusSearch from './pages/BusSearch';
import BookingHistory from './pages/BookingHistory';
import IoTDashboard from './pages/IoTDashboard';
import RFIDBoarding from './pages/RFIDBoarding';
import AITravelAssistant from './pages/AITravelAssistant';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <DataProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/search" element={
                  <ProtectedRoute>
                    <Layout>
                      <BusSearch />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <Layout>
                      <BookingHistory />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/iot-dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <IoTDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/rfid-boarding" element={
                  <ProtectedRoute>
                    <Layout>
                      <RFIDBoarding />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/ai-assistant" element={
                  <ProtectedRoute>
                    <Layout>
                      <AITravelAssistant />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                  <AdminRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </AdminRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Default Route */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </Router>
        </DataProvider>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;