import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { 
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface ReviewFormData {
  bookingId: string
  busId: number
  rating: number
  title: string
  comment: string
  comfortRating: number
  cleanlinessRating: number
  punctualityRating: number
  driverRating: number
  amenitiesRating: number
  wouldRecommend: boolean
}

const ReviewPage: React.FC = () => {
  const { user } = useAuth()
  const { getUserBookings, addReview, getUserReviews } = useData()
  
  const [userBookings, setUserBookings] = useState(getUserBookings(user?.email || ''))
  const [userReviews, setUserReviews] = useState(getUserReviews(user?.email || ''))
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [formData, setFormData] = useState<ReviewFormData>({
    bookingId: '',
    busId: 0,
    rating: 0,
    title: '',
    comment: '',
    comfortRating: 0,
    cleanlinessRating: 0,
    punctualityRating: 0,
    driverRating: 0,
    amenitiesRating: 0,
    wouldRecommend: false
  })

  useEffect(() => {
    if (user?.email) {
      setUserBookings(getUserBookings(user.email))
      setUserReviews(getUserReviews(user.email))
    }
  }, [user?.email, getUserBookings, getUserReviews])

  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking)
    setFormData({
      bookingId: booking.id,
      busId: booking.busId,
      rating: 0,
      title: '',
      comment: '',
      comfortRating: 0,
      cleanlinessRating: 0,
      punctualityRating: 0,
      driverRating: 0,
      amenitiesRating: 0,
      wouldRecommend: false
    })
    setShowReviewForm(true)
  }

  const handleRatingChange = (field: keyof ReviewFormData, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }))
  }

  const handleInputChange = (field: keyof ReviewFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newReview = {
        id: `RV${Date.now().toString().slice(-8)}`,
        bookingId: formData.bookingId,
        busId: formData.busId,
        busNumber: `SB-${formData.busId.toString().padStart(3, '0')}`,
        passengerEmail: user?.email || '',
        passengerName: user?.firstName + ' ' + user?.lastName || '',
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        comfortRating: formData.comfortRating,
        cleanlinessRating: formData.cleanlinessRating,
        punctualityRating: formData.punctualityRating,
        driverRating: formData.driverRating,
        amenitiesRating: formData.amenitiesRating,
        wouldRecommend: formData.wouldRecommend,
        reviewDate: new Date().toISOString().split('T')[0],
        journeyDate: selectedBooking?.travelDate || '',
        route: selectedBooking?.route || '',
        verified: true
      }

      addReview(newReview)
      setSubmitSuccess(true)
      setShowReviewForm(false)
      
      // Refresh user reviews
      if (user?.email) {
        setUserReviews(getUserReviews(user.email))
      }
      
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, onRatingChange: (rating: number) => void, size: 'sm' | 'md' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="focus:outline-none"
          >
            {star <= rating ? (
              <StarIconSolid className={`${sizeClass} text-yellow-400`} />
            ) : (
              <StarIcon className={`${sizeClass} text-gray-300`} />
            )}
          </button>
        ))}
      </div>
    )
  }

  const getBookingStatus = (booking: any) => {
    const journeyDate = new Date(booking.travelDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (journeyDate < today) {
      return 'completed'
    } else if (journeyDate.getTime() === today.getTime()) {
      return 'today'
    } else {
      return 'upcoming'
    }
  }

  const canReviewBooking = (booking: any) => {
    const status = getBookingStatus(booking)
    const hasExistingReview = userReviews.some(review => review.bookingId === booking.id)
    return status === 'completed' && !hasExistingReview
  }

  if (!user || user.role === 'admin') {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <XCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only passengers can submit reviews.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Journey</h1>
        <p className="text-gray-600">Share your travel experience and help other passengers make informed decisions</p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Review submitted successfully!</p>
          </div>
        </div>
      )}

      {/* Bookings List */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Your Completed Journeys</h2>
        
        {userBookings.length > 0 ? (
          <div className="space-y-4">
            {userBookings.map((booking) => {
              const status = getBookingStatus(booking)
              const canReview = canReviewBooking(booking)
              const hasReview = userReviews.some(review => review.bookingId === booking.id)
              
              return (
                <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <TruckIcon className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-black">{booking.route}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{booking.travelDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Seat {booking.seatNumber}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Bus:</span>
                          <span className="ml-2 text-black">{booking.busId}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Departure:</span>
                          <span className="ml-2 text-black">{booking.departureTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Arrival:</span>
                          <span className="ml-2 text-black">{booking.arrivalTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Amount:</span>
                          <span className="ml-2 text-black">₹{booking.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      {status === 'completed' && hasReview ? (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircleIcon className="h-5 w-5" />
                          <span className="text-sm font-medium">Reviewed</span>
                        </div>
                      ) : canReview ? (
                        <button
                          onClick={() => handleBookingSelect(booking)}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          Write Review
                        </button>
                      ) : status === 'upcoming' ? (
                        <span className="text-sm text-gray-500">Journey not completed</span>
                      ) : (
                        <span className="text-sm text-gray-500">Cannot review</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Completed Journeys</h3>
            <p className="text-gray-500">Complete a journey to write a review.</p>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-black">Write Your Review</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Journey Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-black mb-2">Journey Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Route:</span>
                    <span className="ml-2 text-black">{selectedBooking.route}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 text-black">{selectedBooking.travelDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Seat:</span>
                    <span className="ml-2 text-black">{selectedBooking.seatNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Bus:</span>
                    <span className="ml-2 text-black">SB-{selectedBooking.busId.toString().padStart(3, '0')}</span>
                  </div>
                </div>
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Overall Rating *
                </label>
                {renderStars(formData.rating, (rating) => handleRatingChange('rating', rating))}
              </div>

              {/* Review Title */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="input-field w-full"
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Detailed Review *
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.target.value)}
                  className="input-field w-full h-24"
                  placeholder="Tell us about your journey experience..."
                  required
                />
              </div>

              {/* Detailed Ratings */}
              <div className="space-y-4">
                <h4 className="font-medium text-black">Detailed Ratings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Comfort</label>
                    {renderStars(formData.comfortRating, (rating) => handleRatingChange('comfortRating', rating), 'sm')}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Cleanliness</label>
                    {renderStars(formData.cleanlinessRating, (rating) => handleRatingChange('cleanlinessRating', rating), 'sm')}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Punctuality</label>
                    {renderStars(formData.punctualityRating, (rating) => handleRatingChange('punctualityRating', rating), 'sm')}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Driver</label>
                    {renderStars(formData.driverRating, (rating) => handleRatingChange('driverRating', rating), 'sm')}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Amenities</label>
                    {renderStars(formData.amenitiesRating, (rating) => handleRatingChange('amenitiesRating', rating), 'sm')}
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.wouldRecommend}
                    onChange={(e) => handleInputChange('wouldRecommend', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-black">I would recommend this bus service</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formData.rating === 0 || !formData.title || !formData.comment}
                  className="btn-primary flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User's Reviews */}
      {userReviews.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Your Reviews</h2>
          <div className="space-y-4">
            {userReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-black">{review.title}</h3>
                    <p className="text-sm text-gray-600">{review.route} • {review.journeyDate}</p>
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
                <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Comfort: {review.comfortRating}/5</span>
                  <span>Cleanliness: {review.cleanlinessRating}/5</span>
                  <span>Punctuality: {review.punctualityRating}/5</span>
                  <span>Driver: {review.driverRating}/5</span>
                  <span>Amenities: {review.amenitiesRating}/5</span>
                  {review.wouldRecommend && (
                    <span className="text-green-600 font-medium">✓ Recommended</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewPage
