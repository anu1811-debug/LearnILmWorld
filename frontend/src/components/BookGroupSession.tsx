import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Clock, Star, Dot } from 'lucide-react';

const BookGroupSession = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  if (loading) return <div className="text-center mt-20 animate-pulse text-[#5186cd]">Loading group classes...</div>;

  return (
    <>
      <div className='bg-gradient-to-tr from-white via-white to-[#79A2CE4D] min-h-screen pb-20'>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 mt-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Book a Group Session</h2>

          {classes.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg">No upcoming group classes scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {classes.map((cls) => {
                const startDate = new Date(cls.startTime);
                const enrolled = cls.enrolledStudents?.length || 0;
                const slotsLeft = cls.maxParticipants - enrolled;
                const isFull = slotsLeft <= 0;
                
                const teacherName = cls.teacherId?.name 
                const rating = cls.teacherId?.stats?.rating 
                const experience = cls.teacherId?.profile?.experience 
                const subject = cls.title 
                const totaltime= cls.durationMinutes

                return (
                  <div key={cls._id} className="bg-white border border-gray-600 p-5 rounded-[1.25rem] shadow-sm max-w-[800px] flex flex-col gap-4">
                    
                    {/* Header: Name, Experience, Rating */}
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="text-xl font-bold text-black tracking-tight">
                            {teacherName}
                          </h3>
                          <span className="text-[13px] text-gray-700 font-medium ">
                            {experience}+ years experience
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Star className="w-4 h-4 fill-[#FBC02D] text-[#FBC02D]" />
                          <span className="text-[14px] font-semibold text-gray-700">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-[14px] flex">{subject} <Dot className='text-gray-700'/> {totaltime} min</p>
                    </div>

                    {/* Metadata Row: Date, Slots, Time */}
                    <div className="flex items-center justify-between text-gray-700 text-[13px] pt-1 pb-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{slotsLeft} slots left</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>
                          {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleJoinClass(cls)}
                      disabled={isFull}
                      className={`w-full py-2.5 rounded-xl text-[15px]  font-medium transition-all ${
                        isFull 
                        ? 'bg-red-600 text-white border cursor-not-allowed' 
                        : 'bg-[#024aac] text-white border  hover:bg-[#033d8e]'
                      }`}
                    >
                      {isFull ? 'Class Full' : 'Join Session'}
                    </button>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookGroupSession;