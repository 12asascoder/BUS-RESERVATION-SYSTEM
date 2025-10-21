import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  TruckIcon, 
  CpuChipIcon, 
  IdentificationIcon, 
  SparklesIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const HomePage: React.FC = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: IdentificationIcon,
      title: 'RFID Smart Boarding',
      description: 'Lightning-fast boarding with RFID-enabled tickets and real-time verification.',
      gradient: 'from-indigo-500 to-purple-600',
      href: '/rfid-boarding'
    },
    {
      icon: CpuChipIcon,
      title: 'IoT Sensor Integration',
      description: 'Monitor cabin temperature, humidity, vibration, and seat occupancy in real-time.',
      gradient: 'from-cyan-400 to-blue-500',
      href: '/iot-dashboard'
    },
    {
      icon: SparklesIcon,
      title: 'AI Travel Assistant',
      description: 'Get personalized seat recommendations and predictive travel insights powered by AI.',
      gradient: 'from-emerald-400 to-teal-500',
      href: '/ai-assistant'
    },
    {
      icon: ChartBarIcon,
      title: 'Energy Analytics',
      description: 'Track fuel efficiency and driver behavior with comprehensive green scoring.',
      gradient: 'from-pink-400 to-rose-500',
      href: '/analytics'
    }
  ]

  const stats = [
    { label: 'Active Buses', value: '50+', icon: TruckIcon },
    { label: 'Routes Covered', value: '25+', icon: ChartBarIcon },
    { label: 'Daily Passengers', value: '10K+', icon: IdentificationIcon },
    { label: 'IoT Sensors', value: '500+', icon: CpuChipIcon }
  ]

  const benefits = [
    'Real-time IoT monitoring',
    'AI-powered recommendations',
    'RFID smart boarding',
    'Energy optimization',
    'Predictive maintenance',
    'Green scoring system'
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center relative">
        {/* Cosmic Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-30 floating shadow-2xl shadow-purple-500/50"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-25 floating shadow-2xl shadow-cyan-400/50" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-20 floating shadow-2xl shadow-emerald-400/50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-15 floating shadow-2xl shadow-pink-400/50" style={{animationDelay: '3s'}}></div>
        
        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">SMARTBUS2+</span>
          </h1>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8">
                Futuristic Bus Reservation System
              </h2>
              <p className="text-xl md:text-2xl mb-12 max-w-5xl mx-auto leading-relaxed">
                The <span className="text-yellow-300 font-bold">ultimate platform</span> for seamless bus booking, 
                <span className="text-green-300 font-bold"> instant RFID check-ins</span>, and 
                <span className="text-blue-300 font-bold"> real-time IoT analytics</span>.
              </p>
          
          {user ? (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {user.role === 'admin' ? (
                <>
                  <Link to="/dashboard" className="btn-primary text-xl px-10 py-5 flex items-center space-x-3">
                    <ChartBarIcon className="w-7 h-7" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <Link to="/booking" className="btn-secondary text-xl px-10 py-5 flex items-center space-x-3">
                    <TruckIcon className="w-7 h-7" />
                    <span>Manage Bookings</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/passenger-booking" className="btn-primary text-xl px-10 py-5 flex items-center space-x-3">
                    <TruckIcon className="w-7 h-7" />
                    <span>Book Your Journey</span>
                  </Link>
                  <Link to="/profile" className="btn-secondary text-xl px-10 py-5 flex items-center space-x-3">
                    <ChartBarIcon className="w-7 h-7" />
                    <span>My Bookings</span>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/register" className="btn-primary text-xl px-10 py-5 flex items-center space-x-3">
                <SparklesIcon className="w-7 h-7" />
                <span>Get Started Free</span>
              </Link>
              <Link to="/login" className="glass-button text-xl px-10 py-5 flex items-center space-x-3 text-white">
                <span>Sign In</span>
                <ArrowRightIcon className="w-6 h-6" />
              </Link>
            </div>
          )}
          
          <p className="text-lg text-gray-400 mt-8">
            Trusted by <span className="text-yellow-300 font-bold">10,000+</span> passengers worldwide
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-purple-500/50">
                <stat.icon className="w-10 h-10 text-white" />
              </div>
              <div className="text-5xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="font-medium text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
            Revolutionary Features
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
            Experience the future of transportation with our cutting-edge technology stack
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group cursor-pointer" onClick={() => window.location.href = feature.href}>
              <div className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-300 transition-colors">
                {feature.title}
              </h3>
                  <p className="mb-6 leading-relaxed text-lg">
                    {feature.description}
                  </p>
              <div className="flex items-center text-blue-300 font-semibold group-hover:text-blue-200 transition-colors text-lg">
                <span>Explore Feature</span>
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Showcase */}
      <div className="glass-card">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            Built with Cutting-Edge Technology
          </h2>
              <p className="text-xl">
                Powered by the latest technologies for maximum performance and reliability
              </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-purple-500/20">
            <BoltIcon className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Backend</h3>
            <p className="leading-relaxed text-lg">
              Java Spring Boot 3+ • Microservices • PostgreSQL • Redis • Kafka • WebSocket
            </p>
          </div>
          <div className="text-center p-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20">
            <GlobeAltIcon className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Frontend</h3>
            <p className="leading-relaxed text-lg">
              React 18+ • TypeScript • TailwindCSS • Vite • Real-time WebSocket
            </p>
          </div>
          <div className="text-center p-8 rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border border-emerald-400/20">
            <ShieldCheckIcon className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Innovation</h3>
            <p className="leading-relaxed text-lg">
              RFID Integration • IoT Sensors • AI/ML • Facial Recognition • Blockchain Tokens
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="glass-card">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            Why Choose SmartBus2+?
          </h2>
              <p className="text-xl">
                Experience the benefits of next-generation transportation technology
              </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-4 p-6 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300">
              <CheckCircleIcon className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <span className="font-medium text-lg">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="glass-card">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-6">
            What Our Users Say
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Daily Commuter",
              quote: "SmartBus2+ has revolutionized my daily commute. The RFID boarding is incredibly fast and the IoT monitoring gives me peace of mind."
            },
            {
              name: "Mike Chen",
              role: "Business Traveler",
              quote: "The AI assistant helps me find the perfect seat every time. The energy analytics show how eco-friendly my trips are."
            },
            {
              name: "Emily Rodriguez",
              role: "Frequent Traveler",
              quote: "The real-time telemetry and smart features make every journey comfortable and efficient. This is the future of bus travel!"
            }
          ].map((testimonial, i) => (
            <div key={i} className="text-center p-8 rounded-xl bg-white/10">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, j) => (
                  <StarIcon key={j} className="w-6 h-6 text-yellow-400" />
                ))}
              </div>
                  <p className="mb-6 italic text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="font-semibold text-xl">{testimonial.name}</div>
                  <div className="text-sm text-lg">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center glass-card">
        <h2 className="text-5xl font-bold gradient-text mb-8">
          Ready to Experience the Future?
        </h2>
            <p className="text-2xl mb-12 max-w-3xl mx-auto">
              Join thousands of passengers who have already experienced smart travel with our revolutionary system.
            </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-6 sm:space-y-0 sm:space-x-8">
          <Link to="/register" className="btn-primary text-xl px-12 py-6 flex items-center space-x-3">
            <SparklesIcon className="w-7 h-7" />
            <span>Start Your Journey</span>
          </Link>
          <button className="glass-button text-xl px-12 py-6 flex items-center space-x-3 text-white">
            <PlayIcon className="w-6 h-6" />
            <span>Watch Demo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
