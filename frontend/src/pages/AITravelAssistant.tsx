import React, { useState } from 'react';
import { 
  SparklesIcon,
  PaperAirplaneIcon,
  UserIcon,
  ClockIcon,
  MapPinIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const AITravelAssistant: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your SmartBus2+ AI Travel Assistant. How can I help you with your journey today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('book') || input.includes('reserve')) {
      return 'To book a bus, you can use our search feature or launch the Java GUI for advanced booking with seat selection. Would you like me to guide you through the booking process?';
    }
    
    if (input.includes('route') || input.includes('bus') || input.includes('schedule')) {
      return 'I can help you find bus routes and schedules. We have buses connecting major cities like Mumbai, Delhi, Bangalore, Chennai, and more. What specific route are you looking for?';
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('fare')) {
      return 'Bus fares vary by route and bus type. AC Sleeper buses typically cost ₹2000-4000, while Non-AC Seater buses range from ₹1000-2000. Would you like me to check prices for a specific route?';
    }
    
    if (input.includes('time') || input.includes('duration') || input.includes('how long')) {
      return 'Journey times depend on the route and distance. For example, Mumbai to Delhi takes about 10-12 hours, while Bangalore to Chennai takes 6-8 hours. Which route are you interested in?';
    }
    
    if (input.includes('cancel') || input.includes('refund')) {
      return 'You can cancel your booking through the booking history page or the Java GUI. Refund policies vary by timing - cancellations 24+ hours before departure get full refund, while last-minute cancellations may have charges.';
    }
    
    if (input.includes('help') || input.includes('support')) {
      return 'I\'m here to help! I can assist with booking, route information, pricing, schedules, cancellations, and general travel advice. What specific help do you need?';
    }
    
    if (input.includes('weather') || input.includes('condition')) {
      return 'I can provide general travel advice, but for current weather conditions, I recommend checking a weather service. For travel planning, consider weather when choosing departure times.';
    }
    
    if (input.includes('amenities') || input.includes('facilities')) {
      return 'Our buses offer various amenities: AC Sleeper buses have reclining seats, blankets, and charging ports. AC Seater buses have comfortable seats and charging ports. All buses have GPS tracking and emergency contacts.';
    }
    
    if (input.includes('safety') || input.includes('security')) {
      return 'Safety is our priority! All buses have GPS tracking, emergency contacts, trained drivers, and regular maintenance. We also have RFID boarding for passenger tracking and IoT monitoring for real-time bus status.';
    }
    
    if (input.includes('payment') || input.includes('pay')) {
      return 'We accept multiple payment methods: Credit/Debit cards, UPI, digital wallets, and net banking. The Java GUI offers the most comprehensive payment options with secure processing.';
    }
    
    // Default responses
    const defaultResponses = [
      'That\'s an interesting question! I\'m here to help with bus booking, route information, schedules, and travel advice. Could you be more specific about what you need?',
      'I\'d be happy to help! I can assist with booking buses, finding routes, checking schedules, pricing information, and general travel guidance. What would you like to know?',
      'Great question! I can help you with bus bookings, route planning, schedule information, pricing, and travel tips. How can I make your journey easier?',
      'I\'m here to assist with all your bus travel needs! Whether it\'s booking, route information, schedules, or travel advice, I\'m ready to help. What do you need?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Travel Assistant</h1>
        <p className="text-gray-600 mt-2">
          Get instant help with your bus travel needs
        </p>
      </div>

      {/* Chat Interface */}
      <div className="card h-96 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'assistant' && (
                    <SparklesIcon className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="w-4 h-4 text-purple-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about bus travel..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={() => setInputMessage('How do I book a bus?')}
          className="card hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TruckIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Book a Bus</h3>
              <p className="text-sm text-gray-600">Get help with booking</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setInputMessage('What are the bus routes available?')}
          className="card hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Find Routes</h3>
              <p className="text-sm text-gray-600">Check available routes</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setInputMessage('What are the bus prices?')}
          className="card hover:shadow-lg transition-shadow text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Check Prices</h3>
              <p className="text-sm text-gray-600">Get fare information</p>
            </div>
          </div>
        </button>
      </div>

      {/* AI Assistant Info */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Travel Assistant</h3>
            <p className="text-purple-800 mb-4">
              I'm powered by advanced AI to help you with all aspects of bus travel. I can assist with booking, 
              route planning, pricing, schedules, cancellations, and general travel advice.
            </p>
            <div className="flex flex-wrap gap-2 text-sm text-purple-700">
              <span className="px-2 py-1 bg-purple-100 rounded">Booking Help</span>
              <span className="px-2 py-1 bg-purple-100 rounded">Route Information</span>
              <span className="px-2 py-1 bg-purple-100 rounded">Pricing</span>
              <span className="px-2 py-1 bg-purple-100 rounded">Schedules</span>
              <span className="px-2 py-1 bg-purple-100 rounded">Travel Tips</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITravelAssistant;
