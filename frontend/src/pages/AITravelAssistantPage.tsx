import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  MapIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface AIRecommendation {
  id: string
  type: 'seat' | 'route' | 'timing' | 'comfort'
  title: string
  description: string
  confidence: number
  icon: React.ComponentType<any>
}

const AITravelAssistantPage: React.FC = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Array<{id: string, text: string, isUser: boolean}>>([
    {
      id: '1',
      text: `Hello ${user?.firstName || 'there'}! I'm your AI travel assistant. I can help you with:\n\n🔍 Finding buses for your route\n🪑 Selecting the best seats\n💰 Checking prices and amenities\n🗺️ Route recommendations\n🌤️ Weather updates\n\nWhat can I help you with today?`,
      isUser: false
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const recommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'seat',
      title: 'Window Seat Recommendation',
      description: 'Based on your preference for scenic views and comfort, I recommend seats 3A, 7A, or 11A on Mumbai-Delhi route. These offer excellent window views and optimal comfort scores.',
      confidence: 0.92,
      icon: UserIcon
    },
    {
      id: '2',
      type: 'route',
      title: 'Route Optimization',
      description: 'For your Mumbai to Delhi trip, Route A via Express Highway offers 15% faster travel time with current traffic conditions. Estimated arrival: 8:45 PM.',
      confidence: 0.87,
      icon: MapIcon
    },
    {
      id: '3',
      type: 'timing',
      title: 'Optimal Departure Time',
      description: 'Based on historical data, departing at 8:00 AM gives you the best balance of punctuality (95%) and comfort (88%) for Indian routes.',
      confidence: 0.89,
      icon: ClockIcon
    },
    {
      id: '4',
      type: 'comfort',
      title: 'Comfort Enhancement',
      description: 'SmartBus Pro SB-001 shows optimal environmental conditions: 24°C temperature, 45% humidity, and low vibration levels.',
      confidence: 0.94,
      icon: LightBulbIcon
    }
  ]

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Bus availability queries
    if (input.includes('bus') && (input.includes('available') || input.includes('book') || input.includes('find'))) {
      if (input.includes('delhi') && input.includes('mumbai')) {
        return "Great! I found several buses available for Delhi to Mumbai route:\n\n🚌 **SmartBus Pro SB-001** - Departs 8:00 AM, ₹1,200\n🚌 **FutureBus Elite SB-002** - Departs 2:00 PM, ₹1,500\n🚌 **EcoBus Premium SB-003** - Departs 8:00 PM, ₹1,800\n\nAll buses have AC, WiFi, and RFID boarding. Would you like me to help you select the best seat?"
      } else if (input.includes('mumbai') && input.includes('delhi')) {
        return "Perfect! For Mumbai to Delhi route, I have these options:\n\n🚌 **SmartBus Pro SB-001** - Departs 7:30 AM, ₹1,200\n🚌 **FutureBus Elite SB-002** - Departs 1:30 PM, ₹1,500\n🚌 **EcoBus Premium SB-003** - Departs 7:30 PM, ₹1,800\n\nI recommend the morning departure for better traffic conditions. Which timing works best for you?"
      } else {
        return "I'd be happy to help you find buses! Please let me know:\n• Your departure city\n• Your destination city\n• Preferred travel date\n\nFor example: 'I want to book a bus from Delhi to Mumbai for tomorrow'"
      }
    }
    
    // Seat selection queries
    if (input.includes('seat') || input.includes('sit')) {
      if (input.includes('window')) {
        return "For window seats, I recommend:\n\n🪟 **Seats 3A, 7A, 11A** - Best scenic views\n🪟 **Seats 4A, 8A, 12A** - Good comfort + views\n\nThese seats offer excellent views of Indian landscapes and have optimal comfort scores (90%+). Window seats cost ₹50 extra but provide the best experience!"
      } else if (input.includes('aisle')) {
        return "For aisle seats, I suggest:\n\n🚶 **Seats 3B, 7B, 11B** - Easy access\n🚶 **Seats 4B, 8B, 12B** - Good legroom\n\nAisle seats are perfect if you prefer easy movement and don't mind occasional disturbance from other passengers."
      } else {
        return "I can help you choose the best seat! Here are your options:\n\n🪟 **Window seats (A & D)** - Scenic views, ₹50 extra\n🚶 **Aisle seats (B & C)** - Easy access, standard price\n\nWhat type of seat do you prefer? I can also recommend specific seat numbers based on comfort scores."
      }
    }
    
    // Route and timing queries
    if (input.includes('route') || input.includes('time') || input.includes('departure')) {
      return "Based on current traffic analysis:\n\n⏰ **Morning departures (7-9 AM)** - Best for punctuality (95% on-time)\n⏰ **Afternoon departures (1-3 PM)** - Moderate traffic, good comfort\n⏰ **Evening departures (7-9 PM)** - Night travel, less traffic\n\nFor Indian routes, I recommend morning departures to avoid city rush hours. Which timing works best for your schedule?"
    }
    
    // Price queries
    if (input.includes('price') || input.includes('cost') || input.includes('₹') || input.includes('rupee')) {
      return "Here are the current pricing options:\n\n💰 **Standard seats** - ₹1,200-1,500\n💰 **Window seats** - ₹1,250-1,550 (+₹50)\n💰 **Premium buses** - ₹1,800-2,200\n\nPrices vary by bus operator and amenities. All prices include taxes. Would you like me to find the best value option for your budget?"
    }
    
    // Comfort and amenities queries
    if (input.includes('comfort') || input.includes('amenities') || input.includes('ac') || input.includes('wifi')) {
      return "Our buses offer premium amenities:\n\n✅ **AC Climate Control** - 24°C optimal temperature\n✅ **Free WiFi** - High-speed internet\n✅ **USB Charging** - Every seat has charging ports\n✅ **Entertainment** - Movies and music\n✅ **RFID Boarding** - Quick and secure\n✅ **IoT Sensors** - Real-time comfort monitoring\n\nAll buses maintain 90%+ comfort scores. Is there a specific amenity you're most interested in?"
    }
    
    // Weather queries
    if (input.includes('weather') || input.includes('rain') || input.includes('sunny')) {
      return "Current weather forecast for your route:\n\n🌤️ **Delhi to Mumbai** - Clear skies, 28°C\n🌤️ **Mumbai to Delhi** - Partly cloudy, 26°C\n\nPerfect travel conditions! No delays expected due to weather. A window seat would provide excellent views of the countryside."
    }
    
    // General help queries
    if (input.includes('help') || input.includes('what can you do')) {
      return "I'm your AI travel assistant! I can help you with:\n\n🔍 **Find buses** - Search available routes and schedules\n🪑 **Select seats** - Get personalized seat recommendations\n🗺️ **Route optimization** - Find the fastest routes\n💰 **Price comparison** - Compare fares and amenities\n🌤️ **Weather updates** - Check travel conditions\n📱 **Booking assistance** - Guide you through the booking process\n\nWhat would you like help with today?"
    }
    
    // Default response for unclear queries
    return "I understand you're looking for travel assistance! I can help you with:\n\n• Finding available buses for your route\n• Selecting the best seats\n• Checking prices and amenities\n• Route and timing recommendations\n\nCould you be more specific about what you need help with? For example: 'I want to book a bus from Delhi to Mumbai' or 'Help me choose a good seat'"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Generate contextual AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        isUser: false
      }

      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">AI Travel Assistant</h1>
        <p>Get personalized recommendations powered by artificial intelligence</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="card h-[600px] flex flex-col">
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold">AI Assistant</h2>
                <p className="text-sm">Online • Ready to help</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-black px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your trip..."
                className="flex-1 input-field text-black"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="btn-primary px-4"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">AI Recommendations</h2>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <rec.icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black text-sm">{rec.title}</h3>
                      <p className="text-xs text-black mt-1">{rec.description}</p>
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${rec.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-black">
                          {(rec.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <p className="font-medium text-black text-sm">Find Best Seats</p>
                <p className="text-xs text-black">Get seat recommendations</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <p className="font-medium text-black text-sm">Route Optimization</p>
                <p className="text-xs text-black">Find fastest route</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <p className="font-medium text-black text-sm">Weather Check</p>
                <p className="text-xs text-black">Check travel conditions</p>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <p className="font-medium text-black text-sm">Comfort Analysis</p>
                <p className="text-xs text-black">Analyze bus comfort</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">AI-Powered Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Smart Seat Selection</h3>
            <p className="text-sm">
              AI analyzes your preferences and bus conditions to recommend the best seats
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Route Optimization</h3>
            <p className="text-sm">
              Real-time traffic analysis and route recommendations for faster travel
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Predictive Timing</h3>
            <p className="text-sm">
              Machine learning predicts optimal departure times and arrival estimates
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <LightBulbIcon className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Comfort Analysis</h3>
            <p className="text-sm">
              IoT sensor data analysis for personalized comfort recommendations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AITravelAssistantPage
