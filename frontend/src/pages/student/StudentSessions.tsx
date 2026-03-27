// src/pages/student/StudentSession.tsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Calendar, Clock, BookOpen, Video, Star
} from 'lucide-react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentSessions: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Naya route jo seedha "Booking" table se data layega
      const response = await axios.get(`${API_BASE_URL}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      // Sirf wo bookings lo jo 'completed' hain (yani payment ho chuki hai)
      setBookings(
        Array.isArray(response.data) 
          ? response.data.filter((b) => b.paymentStatus === "completed") 
          : []
      )
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#1a56ad] font-medium">
        Loading your sessions...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Learning Sessions</h2>

      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          Abhi tak koi class book nahi ki hai. 
          <Link to="/main" className="text-[#1a56ad] font-bold ml-2 hover:underline">
            Browse Trainers
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            
            // Format Date & Time safely
            const sessionDate = booking.date ? new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date Pending';
            const sessionTime = booking.time ? new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

            // Group aur Private classes ke liye alag rang ka tag
            const isGroup = booking.bookingType === 'group';
            const tagColor = isGroup ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

            return (
              <div key={booking._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:shadow-md">

                {/* 1. Trainer Name */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0f5fb] text-[#1a56ad] flex items-center justify-center shrink-0">
                    <User size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Teacher</p>
                    <p className="text-[17px] font-bold text-gray-800">
                      {booking.trainer?.name }
                    </p>
                  </div>
                </div>

                {/* 2. Session Type */}
                <div className="flex flex-col items-start sm:items-center">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${tagColor}`}>
                      {booking.bookingType} Class
                   </span>
                   {booking.duration && (
                     <span className="text-xs text-gray-500 mt-1 font-medium">Duration: {booking.duration} min</span>
                   )}
                </div>

                {/* 3. Time Details */}
                <div className="flex flex-col gap-1 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-w-[160px]">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={14} className="text-[#1a56ad]" />
                    <span className="text-sm font-bold">{sessionDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} className="text-[#1a56ad]" />
                    <span className="text-[13px] font-medium">
                      {sessionTime}
                    </span>
                  </div>
                </div>

                {/* 4. Action Buttons (Future Proofing) */}
                <div className="flex gap-2">
                   <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed" title="Link will appear when trainer starts session">
                     <Video size={16} /> Join
                   </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default StudentSessions