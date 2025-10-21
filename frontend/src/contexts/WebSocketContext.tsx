import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import SockJS from 'sockjs-client'
import { Stomp } from 'stompjs'

interface WebSocketContextType {
  isConnected: boolean
  subscribeToIoT: (callback: (data: any) => void) => () => void
  subscribeToRFID: (callback: (data: any) => void) => () => void
  subscribeToAI: (callback: (data: any) => void) => () => void
  sendMessage: (destination: string, message: any) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}

interface WebSocketProviderProps {
  children: ReactNode
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [stompClient, setStompClient] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Try to connect to WebSocket, but don't block the app if it fails
    const connectWebSocket = async () => {
      try {
        const socket = new SockJS('http://localhost:8080/ws/iot')
        const stomp = Stomp.over(socket)
        
        stomp.debug = false
        
        // Set a timeout for connection
        const connectionTimeout = setTimeout(() => {
          console.log('WebSocket connection timeout - using demo mode')
          setIsConnected(false)
        }, 3000)
        
        stomp.connect({}, () => {
          clearTimeout(connectionTimeout)
          setIsConnected(true)
          setStompClient(stomp)
          console.log('WebSocket connected successfully')
        }, (error: any) => {
          clearTimeout(connectionTimeout)
          console.log('WebSocket connection failed - using demo mode:', error)
          setIsConnected(false)
        })
      } catch (error) {
        console.log('WebSocket initialization failed - using demo mode:', error)
        setIsConnected(false)
      }
    }

    connectWebSocket()

    return () => {
      if (stompClient) {
        stompClient.disconnect()
      }
    }
  }, [])

  const subscribeToIoT = (callback: (data: any) => void) => {
    if (stompClient && isConnected) {
      const subscription = stompClient.subscribe('/topic/iot/environment', callback)
      return () => subscription.unsubscribe()
    }
    return () => {}
  }

  const subscribeToRFID = (callback: (data: any) => void) => {
    if (stompClient && isConnected) {
      const subscription = stompClient.subscribe('/topic/rfid/events', callback)
      return () => subscription.unsubscribe()
    }
    return () => {}
  }

  const subscribeToAI = (callback: (data: any) => void) => {
    if (stompClient && isConnected) {
      const subscription = stompClient.subscribe('/topic/ai/recommendations', callback)
      return () => subscription.unsubscribe()
    }
    return () => {}
  }

  const sendMessage = (destination: string, message: any) => {
    if (stompClient && isConnected) {
      stompClient.send(destination, {}, JSON.stringify(message))
    }
  }

  const value: WebSocketContextType = {
    isConnected,
    subscribeToIoT,
    subscribeToRFID,
    subscribeToAI,
    sendMessage
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}
