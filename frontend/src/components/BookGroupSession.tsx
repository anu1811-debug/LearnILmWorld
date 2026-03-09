import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, Star, Dot } from 'lucide-react';

const BookGroupSession = ({ trainerId }: { trainerId: string }) => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/class-schedule/group-sessions/${trainerId}`);
        setClasses(res.data.classes);
      } catch (error) {
        console.error("Failed to fetch group classes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [trainerId, API_BASE_URL]);

  const handleJoinClass = (groupClass: any) => {
    if (groupClass.enrolledStudents?.length >= groupClass.maxParticipants) {
      alert("Sorry, this class is full!");
      return;
    }
    navigate('/payment', {
      state: { 
        trainerId, 
        classId: groupClass._id, 
        type: 'group', 
        title: groupClass.title, 
        date: groupClass.startTime 
      }
    });
  };

  if (loading) return <div className="text-center py-10 animate-pulse text-[#5186cd]">Loading group classes...</div>;

  return (
    <div className="w-full">
      {classes.length === 0 ? (
        <div className="bg-gray-50 p-6 sm:p-8 text-center rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-base sm:text-lg">No upcoming group classes scheduled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {classes.map((cls) => {
            const startDate = new Date(cls.startTime);
            const enrolled = cls.enrolledStudents?.length || 0;
            const slotsLeft = cls.maxParticipants - enrolled;
            const isFull = slotsLeft <= 0;
            
            const teacherName = cls.teacherId?.name; 
            const rating = cls.teacherId?.stats?.rating || 5.0; 
            const experience = cls.teacherId?.profile?.experience || 0; 
            const subject = cls.title; 
            const totaltime= cls.durationMinutes;

            return (
              <div key={cls._id} className="bg-white border border-gray-200 p-4 sm:p-5 rounded-[1.25rem] shadow-sm flex flex-col gap-3 sm:gap-4 w-full">
                
                {/* Header Section */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 sm:mb-2 gap-2 sm:gap-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight">{teacherName}</h3>
                      <span className="text-xs sm:text-[13px] text-gray-500 font-medium">{experience}+ years experience</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 px-2 py-0.5  sm:bg-transparent sm:border-none sm:p-0">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FBC02D] text-[#FBC02D]" />
                      <span className="text-xs sm:text-[14px] font-semibold text-gray-700">{Number(rating).toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-[14px] flex items-center">{subject} <Dot className='text-gray-400 mx-1'/> {totaltime} min</p>
                </div>

                {/* Metadata Row: Added flex-wrap for mobile */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 text-xs sm:text-[13px] pt-1 pb-2">
                  <div className="flex items-center gap-1.5 min-w-fit">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-fit">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{slotsLeft} slots left</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-fit">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleJoinClass(cls)}
                  disabled={isFull}
                  className={`w-full py-2.5 sm:py-3 rounded-xl text-sm sm:text-[15px] font-medium transition-all ${isFull ? 'bg-red-500 text-white cursor-not-allowed' : 'bg-[#024aac] text-white hover:bg-[#033d8e]'}`}
                >
                  {isFull ? 'Class Full' : 'Join Session'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookGroupSession;