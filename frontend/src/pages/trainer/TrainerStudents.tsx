import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, User as UserIcon, BookOpen, SlidersHorizontal, CheckCircle2, Users } from 'lucide-react';
import moment from 'moment-timezone';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// TypeScript Interface to resolve errors
interface Booking {
  _id: string;
  time?: string;
  startTime?: string;
  date?: string;
  duration?: number;
  bookingType?: string;
  studentName?: string;
  student?: { name: string };
  status?: string;
  sessionId?: string | any; 
  roomId?: string | any;
}

const TrainerStudents: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filterFlash, setFilterFlash] = useState(false);

  const trainerTz = user?.profile?.timezone || moment.tz.guess();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/bookings/trainer-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const now = new Date();

  const filteredBookings = bookings.filter((b) => {
    const isSessionLinked = Boolean(b.sessionId || b.roomId);
  const currentStatus = b.status?.toLowerCase();
  if (activeTab === "upcoming") {
    return !isSessionLinked || currentStatus === "pending" || currentStatus === "confirmed";
  }
  if (activeTab === "completed") {
    return isSessionLinked && (currentStatus === "completed" || currentStatus === "ended" || currentStatus === "active");
  }
  if (activeTab === "group") return b.bookingType?.toLowerCase().includes("group");
  if (activeTab === "private") return b.bookingType?.toLowerCase().includes("private");

  return true;
});

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* TABS SECTION */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
       
        {["all", "upcoming", "completed", "group", "private"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm border capitalize transition-all ${activeTab === tab ? "bg-[#1a56ad] text-white border-[#1a56ad]" : "bg-white text-gray-500 border-gray-200"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const bDate = new Date(booking.time || booking.startTime || booking.date || new Date());
          const isDone = bDate < now || booking.status === 'completed';
          
          const start = moment(bDate).tz(trainerTz);
          const displayDate = start.format('ddd Do MMM');
          const end = booking.duration ? moment(start).add(booking.duration, 'minutes') : null;
          const displayTime = end ? `${start.format('hh:mm A')} - ${end.format('hh:mm A')}` : start.format('hh:mm A');

          return (
            <div key={booking._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
              
              {/* LEFT CONTENT  */}
              <div className="flex flex-col gap-1.5">
                {/* 1st Line: Name */}
                <h3 className="text-lg font-bold text-gray-900">
                  {booking.studentName || booking.student?.name || "Paridhi"}
                </h3>

                {/* Session Type */}
                <div className="flex items-center gap-2 text-[#4c85d6] text-sm font-medium">
                  {booking.bookingType?.toLowerCase().includes('group') ? <Users size={15} /> : <BookOpen size={15} />}
                  <span className='text-gray-600'>{booking.bookingType || "Group"} Session</span>
                </div>

                {/*Date & Time in one line */}
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#4c85d6]" />
                    <span>{displayDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-[#4c85d6]" />
                    <span>{displayTime}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: STATUS BADGE */}
              <div className="flex-shrink-0">
                {isDone ? (
                  <div className="flex items-center gap-1.5 text-[#4c85d6] font-semibold text-sm">
                    <span>Completed</span>
                    <CheckCircle2 size={18} />
                  </div>
                ) : (
                  <span className="bg-[#1a56ad] text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                    Upcoming
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainerStudents;