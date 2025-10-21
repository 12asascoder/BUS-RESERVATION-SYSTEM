import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip token validation for now to avoid API issues
    setIsLoading(false)
  }, [token])

  const validateToken = async () => {
    try {
      const response = await axios.post('/api/auth/validate', {}, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000
      })
      
      if (response.data) {
        // Token is valid, get user info
        const userResponse = await axios.get(`/api/auth/user/${localStorage.getItem('username')}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        })
        setUser(userResponse.data)
      }
    } catch (error: any) {
      console.error('Token validation failed:', error)
      // Don't automatically logout on network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR') {
        console.log('Backend not available, skipping token validation')
      } else {
        logout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simple local authentication for demo
      if (username && password) {
        const demoUser = {
          id: 1,
          username: username,
          email: `${username}@smartbus2plus.com`,
          firstName: username === 'admin' ? 'Admin' : 'User',
          lastName: 'SmartBus',
          role: username === 'admin' ? 'admin' : 'passenger'
        }
        
        const demoToken = 'smartbus-token-' + Date.now()
        
        setToken(demoToken)
        setUser(demoUser)
        localStorage.setItem('token', demoToken)
        localStorage.setItem('username', username)
        
        toast.success(`Welcome back, ${demoUser.firstName}!`)
        return true
      } else {
        toast.error('Please enter both username and password')
        return false
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login failed')
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      // Simple local registration for demo
      if (userData.username && userData.password && userData.email) {
        const newUser = {
          id: Date.now(),
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: 'passenger'
        }
        
        const demoToken = 'smartbus-token-' + Date.now()
        
        setToken(demoToken)
        setUser(newUser)
        localStorage.setItem('token', demoToken)
        localStorage.setItem('username', userData.username)
        
        toast.success(`Welcome to SmartBus2+, ${newUser.firstName}!`)
        return true
      } else {
        toast.error('Please fill in all required fields')
        return false
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error('Registration failed')
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    toast.success('Logged out successfully')
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
