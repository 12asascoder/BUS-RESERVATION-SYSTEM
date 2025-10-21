import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { TruckIcon, EyeIcon, EyeSlashIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    const success = await login(formData.username, formData.password)
    if (success) {
      // Redirect based on user role
      if (formData.username === 'admin') {
        navigate('/dashboard')
      } else {
        navigate('/passenger-booking')
      }
    }
    
    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 floating"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-10 floating" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-5 floating" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center floating">
              <TruckIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-lg">
            Sign in to your SmartBus2+ account
          </p>
        </div>
        
        {/* Login Form */}
        <div className="glass-card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input pr-12"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex justify-center items-center space-x-2 py-4 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="glass-card">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Demo Credentials</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/10">
                <span className="text-gray-300">Admin:</span>
                <code className="text-blue-300 font-mono">admin / admin</code>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/10">
                <span className="text-gray-300">Passenger:</span>
                <code className="text-green-300 font-mono">passenger1 / password</code>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-300">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-300 hover:text-blue-200 font-semibold transition-colors flex items-center justify-center space-x-1"
            >
              <span>Create one now</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
