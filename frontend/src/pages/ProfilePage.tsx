import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  UserIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  TruckIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth()
  const { getUserBookings, getUserReviews } = useData()
  
  // Get bookings and reviews for the current user
  const userBookings = user ? getUserBookings(user.email) : []
  const userReviews = user ? getUserReviews(user.email) : []

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your profile.</p>
        <Link to="/login" className="btn-primary mt-4">
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-10 w-10 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">@{user.username}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="sensor-indicator sensor-good">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* My Bookings - Only for passengers */}
      {user.role === 'passenger' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Bookings</h2>
            <Link to="/passenger-booking" className="btn-primary">
              <TruckIcon className="w-4 h-4 inline mr-2" />
              Book New Journey
            </Link>
          </div>
          
          {userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{booking.route}</h3>
                      <p className="text-gray-600">PNR: {booking.pnrNumber}</p>
                      <div className="flex items-center mt-2">
                        {booking.status === 'confirmed' ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mr-1" />
                        ) : booking.status === 'cancelled' ? (
                          <XCircleIcon className="h-4 w-4 text-red-600 mr-1" />
                        ) : (
                          <ClockIcon className="h-4 w-4 text-yellow-600 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          booking.status === 'confirmed' ? 'text-green-600' : 
                          booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₹{booking.price}</p>
                      <p className="text-sm text-gray-600">Paid</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">{booking.travelDate}</p>
                        <p className="text-gray-600">Travel Date</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">{booking.departureTime}</p>
                        <p className="text-gray-600">Departure</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TruckIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">{booking.seatNumber}</p>
                        <p className="text-gray-600">Seat(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="font-medium">{booking.boardingPoint}</p>
                        <p className="text-gray-600">Boarding</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Booked on {new Date(booking.bookingTime).toLocaleDateString()}
                      </p>
                      {booking.status === 'confirmed' && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
              <p className="text-gray-500 mb-4">Start your journey by booking your first trip!</p>
              <Link to="/passenger-booking" className="btn-primary">
                Book Your First Journey
              </Link>
            </div>
          )}
        </div>
      )}

      {/* My Reviews - Only for passengers */}
      {user.role === 'passenger' && (
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Reviews</h2>
            <Link to="/reviews" className="btn-primary">
              <StarIcon className="w-4 h-4 inline mr-2" />
              Write Review
            </Link>
          </div>
          
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{review.title}</h3>
                      <p className="text-gray-600">{review.route} • {review.journeyDate}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Comfort:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIconSolid
                            key={star}
                            className={`w-3 h-3 ${star <= review.comfortRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cleanliness:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIconSolid
                            key={star}
                            className={`w-3 h-3 ${star <= review.cleanlinessRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Punctuality:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIconSolid
                            key={star}
                            className={`w-3 h-3 ${star <= review.punctualityRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIconSolid
                            key={star}
                            className={`w-3 h-3 ${star <= review.driverRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amenities:</span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIconSolid
                            key={star}
                            className={`w-3 h-3 ${star <= review.amenitiesRating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Bus: {review.busNumber}</span>
                      <span>Date: {review.reviewDate}</span>
                      {review.verified && (
                        <span className="text-green-600 font-medium">✓ Verified</span>
                      )}
                    </div>
                    {review.wouldRecommend && (
                      <span className="text-green-600 font-medium text-sm">✓ Recommended</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <StarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 mb-4">Share your travel experience by writing a review!</p>
              <Link to="/reviews" className="btn-primary">
                Write Your First Review
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-gray-900">{user.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TruckIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Role</p>
                <p className="text-gray-900">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="space-y-4">
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
            <button className="w-full btn-secondary flex items-center justify-center space-x-2">
              <MapPinIcon className="h-5 w-5" />
              <span>Travel Preferences</span>
            </button>
            <button 
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your SmartBus2+ Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Trips Taken</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">8</div>
            <div className="text-sm text-gray-600">RFID Scans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">15</div>
            <div className="text-sm text-gray-600">AI Recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">95%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
