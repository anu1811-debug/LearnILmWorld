import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User as UserIcon, BookOpen, Mail } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainerStudents = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetching bookings for the logged-in trainer
        const res = await axios.get(`${API_BASE_URL}/api/bookings/trainer-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Loading student data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Classes</h2>

      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No class is booked by any student yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
                        const sessionDate = booking.date ? new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date Pending';
            const sessionTime = booking.time ? new Date(booking.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

            return (
              <div key={booking._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:shadow-md">

                {/* Student Name */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0f5fb] text-[#7fa2ce] flex items-center justify-center shrink-0">
                    <UserIcon size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Student Name</p>
                    <p className="text-[17px] font-bold text-gray-800">
                      {booking.studentName || booking.student?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                {/* student email */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0f5fb] text-[#7fa2ce] flex items-center justify-center shrink-0">
                    <Mail size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Student Email</p>
                    <p className="text-[17px] font-bold text-gray-800">
                      {booking.studentEmail ||  'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Class Type */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Session</p>
                    <p className="text-sm font-semibold text-gray-700 capitalize">
                      {booking.bookingType || 'Private'} Class
                    </p>
                  </div>
                </div>

                {/*Time & Duration */}
                <div className="flex flex-col gap-1 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 min-w-[160px]">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={14} className="text-[#7fa2ce]" />
                    <span className="text-sm font-bold">{sessionDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} className="text-[#7fa2ce]" />
                    <span className="text-[13px] font-medium">
                      {sessionTime} {booking.duration ? `(${booking.duration} mins)` : ''}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrainerStudents;