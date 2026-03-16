import React, { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  User, Star, Globe, Award, Calendar,
  MessageSquare, BookOpen, CheckCircle,
  Heart, Book, Play, Quote
} from 'lucide-react'
import axios, { AxiosError } from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookGroupSession from '../components/BookGroupSession'
import BookPrivateSession from '../pages/student/BookPrivateSession'
import moment from 'moment-timezone'

interface Trainer {
  _id: string
  name: string
  profile: {
    bio: string
    category?: string
    languages?: string[]
    subjects?: string[]
    hobbies?: string[]
    standards?: string[]
    trainerLanguages: Array<{ language: string; proficiency: string; teachingLevel: string[] }>
    experience: number
    hourlyRate: number
    imageUrl?: string
    avatar?: string
    location?: string
    timezone?: string
    specializations: string[]
    availability: Array<{ day: string; startTime: string; endTime: string; available: boolean }>
    demoVideo?: string
    socialMedia: { instagram?: string; youtube?: string; linkedin?: string }
    teachingStyle?: string
    studentAge?: string[]
    averageRating?: number
    privateSessionRate?: {
      30: number;
      60: number;
      90: number;
    };
  }
  stats: {
    rating?: number
    totalSessions?: number
    completedSessions?: number
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainerProfile: React.FC = () => {
  const { trainerId } = useParams<{ trainerId: string }>()
  const location = useLocation()

  const initialTab = location.state?.activeTab || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'group' | 'private'>(initialTab);

  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [previewLink, setPreviewLink] = useState<string>("")
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); 
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const demoSectionRef = useRef<HTMLDivElement>(null);

  const passedLearningType = location.state?.learningType;
  const category = passedLearningType || trainer?.profile?.category?.toLowerCase() || 'language';

  const isLanguage = category === 'language';
  const isSubject = category === 'subject';
  const isHobby = category === 'hobby';

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  useEffect(() => {
    if (trainerId) {
      fetchTrainerProfile()
      fetchReviews()
    }
  }, [trainerId])

  const avatar = trainer?.profile?.imageUrl || trainer?.profile?.avatar || ''

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!avatar) return;
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-download-url`, { fileKey: avatar });
        setPreviewLink(data.signedUrl);
      } catch (err) { console.error("Image error", err); }
    };
    fetchProfileImage();
  }, [avatar]);

  useEffect(() => {
    if (!loading && trainer && location.state?.scrollToDemo && activeTab === 'profile') {
      setTimeout(() => {
        demoSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      window.history.replaceState({}, document.title)
    }
  }, [loading, trainer, location.state, activeTab]);

  const fetchTrainerProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile/${trainerId}`)
      setTrainer(response.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleUnlockDemo = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to watch the free demo."); 
        navigate('/login'); 
        return; 
      }
      
      const res = await axios.post(`${API_BASE_URL}/api/bookings/free-demo-access`, {
        trainerId: trainerId,
      }, {
         headers: { Authorization: `Bearer ${token}` } 
      });

      if (res.data.success) {
        setVideoUrl(res.data.videoUrl); 
        setShowModal(false); 
      }
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 401) {
         alert("Session expired. Please login again.");
         navigate('/login');
         return;
      }
      setError((error.response?.data as any)?.message || "Something went wrong!");
    }
  };

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/trainer/${trainerId}`)
      setReviews(Array.isArray(response.data) ? response.data : [])
    } catch (err) { console.error(err) }
  }

  // const formatAvailability = () => {
  //   if (!trainer?.profile?.availability) return []
  //   return trainer.profile.availability
  //     .filter(slot => slot.available)
  //     .map(slot => ({
  //       day: slot.day.charAt(0).toUpperCase() + slot.day.slice(1),
  //       time: `${slot.startTime} - ${slot.endTime}`
  //     }))
  // }

  if (loading || !trainer) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-medium">Loading profile...</div>

  const getCategoryIcon = () => {
    if (isHobby) return <Heart className="text-blue-500" size={24} />;
    if (isSubject) return <Book className="text-blue-500" size={24} />;
    return <Globe className="text-blue-500" size={24} />;
  };

  const getCategoryTitle = () => {
    if (isHobby) return "Hobbies I Teach";
    if (isSubject) return "Subjects I Teach";
    return "Languages I Teach";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-6 sm:py-10 pb-20 px-4 sm:px-6">
        {/* RESPONSIVE GRID: 1 column on mobile, 12 on large screens */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT CARD: Adjusted padding for mobile bg-gradient-to-b from-[#1E40AF] to-[#1e3a8a]*/}
          <div className="lg:col-span-5 bg-[#024aac]  rounded-[2rem] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden self-start lg:sticky lg:top-28 z-10 w-full">
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-blue-400/30 overflow-hidden mb-6 shadow-xl bg-white">
                {previewLink ? (
                  <img src={previewLink} alt={trainer.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-200 text-slate-400 flex items-center justify-center"><User size={40} className="sm:w-12 sm:h-12" /></div>
                )}
              </div>

              {/* Name & Title */}
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold">{trainer.name}</h1>
                <CheckCircle className="text-blue-400 fill-blue-400 text-white" size={20} />
              </div>
              <p className="text-blue-100/80 mb-6 text-base sm:text-lg">
                {isLanguage ? "Language Teacher" : isSubject ? "Subject Expert" : "Hobby Instructor"}
              </p>

              {/* Stats Row: Adjusted gap for small screens */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 w-full max-w-md mb-8 border-t border-b border-white/10 py-5 sm:py-6">
                <div>
                  <div className="flex items-center justify-center gap-1 text-lg sm:text-xl font-bold">
                    <Star className="text-yellow-400 fill-yellow-400 sm:w-[18px]" size={16} />
                    {trainer.stats?.rating || trainer.profile.averageRating || 5.0}
                  </div>
                  <p className="text-[10px] sm:text-xs text-blue-200/70">{reviews.length} reviews</p>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold">{trainer.profile.experience}+</div>
                  <p className="text-[10px] sm:text-xs text-blue-200/70">Years Exp.</p>
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold">{trainer.stats?.completedSessions || 0}+</div>
                  <p className="text-[10px] sm:text-xs text-blue-200/70">Sessions</p>
                </div>
              </div>

              {/* Book Buttons Container */}
              <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full mb-8 sm:mb-10'>
                <button
                  onClick={() => setActiveTab('private')}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold sm:text-lg transition-colors text-center shadow-lg ${activeTab === 'private' ? 'bg-blue-100 text-blue-900 border-2 border-blue-400' : 'bg-white text-blue-900 hover:bg-blue-50'}`}
                >
                  Book Private Session
                </button>
                <button
                  onClick={() => setActiveTab('group')}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-colors text-center shadow-lg ${activeTab === 'group' ? 'bg-blue-100 text-blue-900 border-2 border-blue-400' : 'bg-white text-blue-900 hover:bg-blue-50'}`}
                >
                  Book Group Session
                </button>

                {activeTab !== 'profile' && (
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="mt-2 text-blue-200/80 hover:text-white transition text-sm underline"
                  >
                    ← Back to Profile Information
                  </button>
                )}
              </div>

              {/* About Section */}
              <div className="text-left w-full mb-8 sm:mb-10">
                <h3 className="text-base sm:text-lg font-semibold mb-2">About Me:</h3>
                <p className="text-blue-50/80 leading-relaxed text-sm">
                  {trainer.profile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-7 space-y-5">

            {activeTab === 'profile' && (
              <div className="space-y-5 animate-fade-in">
                {/* 1. DYNAMIC CATEGORY SECTION */}
                <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 mb-4 text-slate-800">
                    {getCategoryIcon()}
                    {getCategoryTitle()}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      let itemsToDisplay: string[] = [];
                      if (isLanguage) {
                        if (trainer.profile?.trainerLanguages && trainer.profile.trainerLanguages.length > 0) {
                          itemsToDisplay = trainer.profile.trainerLanguages.map((tl: any) => tl.language);
                        } else if (trainer.profile?.languages) {
                          itemsToDisplay = trainer.profile.languages;
                        }
                      } else if (isSubject) {
                        itemsToDisplay = trainer.profile?.specializations || [];
                      } else if (isHobby) {
                        itemsToDisplay = trainer.profile?.hobbies || [];
                      }

                      if (itemsToDisplay.length > 0) {
                        return itemsToDisplay.map((item: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-500 rounded-full text-xs sm:text-sm font-semibold">
                            {item}
                          </span>
                        ));
                      } else {
                        return <span className="text-slate-400 text-sm">No items listed</span>;
                      }
                    })()}
                  </div>
                </div>

                {/* 2. SPECIALIZATIONS */}
                {!isSubject && trainer.profile?.specializations && trainer.profile.specializations.length > 0 && (
                  <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 mb-4 text-slate-800">
                      <Award className="text-blue-500" size={24} /> Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trainer.profile.specializations.map((spec: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-500 rounded-full text-xs sm:text-sm font-semibold">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. CLASSES/GRADES */}
                <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 mb-4 text-slate-800">
                    <BookOpen className="text-blue-500" size={24} /> Classes/Grades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.profile?.standards && trainer.profile.standards.length > 0 ? (
                      trainer.profile.standards.map((grade: string) => (
                        <span key={grade} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-50 text-blue-500 rounded-full text-xs sm:text-sm font-semibold">
                          {grade}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm">Not specified</span>
                    )}
                  </div>
                </div>

                {/* 4. AVAILABILITY */}
                <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2 sm:gap-3 text-slate-800">
                    <Calendar className="text-blue-500" size={24} /> Availability
                  </h3>
                  {(() => {
                    if (!trainer?.profile?.availability) return [];

                    // Teacher ka timezone (agar nahi set hai toh UTC maan lenge fallback ke liye)
                    const teacherTz = trainer.profile.timezone || 'UTC';

                    // Browser se student ka apna local timezone nikalna
                    const localTz = moment.tz.guess();

                    const dayMap: { [key: string]: number } = {
                      'sunday': 0,'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6
                    };

                    const availability = trainer.profile.availability
                      .filter(slot => slot.available && slot.startTime && slot.endTime)
                      .map(slot => {
                        const dayNum = dayMap[slot.day.toLowerCase()];

                        // Ek reference date le rahe hain jisse din automatically aage-peeche shift ho sakein
                        const baseDateStr = '2026-01-04';

                        // Teacher ke timezone me exact moment object banana
                        const startMoment = moment.tz(`${baseDateStr} ${slot.startTime}`, "YYYY-MM-DD HH:mm", teacherTz).day(dayNum);
                        const endMoment = moment.tz(`${baseDateStr} ${slot.endTime}`, "YYYY-MM-DD HH:mm", teacherTz).day(dayNum);

                        // Usko Student ke timezone me convert karna
                        const localStart = startMoment.clone().tz(localTz);
                        const localEnd = endMoment.clone().tz(localTz);

                        // Format karna (e.g., "07:30 PM")
                        const localDay = localStart.format('dddd');
                        let localTimeString = `${localStart.format('hh:mm A')} - ${localEnd.format('hh:mm A')}`;

                        // Agar conversion ke chakkar mein din aage chala gaya (jaise Monday se Tuesday)
                        // toh time ke aage din bhi likh denge taaki student ko pata rahe
                        if (localStart.day() !== localEnd.day()) {
                          localTimeString += ` (${localEnd.format('ddd')})`;
                        }

                        return {
                          day: localDay,
                          time: localTimeString
                        }
                      });

                    return availability.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                      {availability.map((slot, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl gap-1 sm:gap-0">
                          <span className="font-semibold text-slate-700 text-sm sm:text-base">{slot.day}</span>
                          <span className="text-slate-500 text-xs sm:text-sm font-medium">{slot.time}</span>
                        </div>
                      ))}
                    </div>
                    ) : (
                      <div className="text-slate-600 text-sm sm:text-base">
                        <p className="mb-1">Available by appointment</p>
                        <p className="font-semibold text-slate-800">Please contact to schedule</p>
                      </div>
                    );
                  })()}
                </div>

                {/* 5. TEACHING STYLE */}
                <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-slate-100">
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 mb-3 text-slate-800">
                    <MessageSquare className="text-blue-500" size={24} /> Teaching Style
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {trainer.profile.teachingStyle || 'Conversational'}
                  </p>
                </div>

                {/* DEMO VIDEO */}
                {trainer.profile?.demoVideo && (
                  <div ref={demoSectionRef} className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 sm:gap-3 mb-4 text-slate-800">
                      <Play className="text-blue-500 fill-blue-500" size={20} /> Demo Video
                    </h3>
                    <div className="p-8">
            {videoUrl ? (
              <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
                {videoUrl.includes('youtube') || videoUrl.includes('youtu.be') ? (
                  <iframe 
                    width="100%" 
                    height="500" 
                    src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}?autoplay=1`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full aspect-video"
                  ></iframe>
                ) : (
                  <video src={videoUrl} controls autoPlay className="w-full h-[300px] object-contain" />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                  🎥
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Experience the Teaching Style</h3>
                <p className="text-gray-500 mb-8 text-center max-w-md">
                  Unlock an exclusive free demo session to see if this mentor is the right fit for your learning journey.
                </p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="group relative px-8 py-4 bg-[#024aac] text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <span className="bg-white text-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">▶</span>
                    Watch Free Demo
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl transform transition-all scale-100">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition"
            >
              ✕
            </button>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 text-xl">
                🔓
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 ">Unlock Free Demo</h3>
              
              <p className="text-gray-500 mb-6">
                You are about to unlock the free demo class for <span className="font-semibold text-blue-700">{trainer?.name}</span>.
                <br/>
                <span className="text-xs text-blue-500 font-medium mt-2 block bg-blue-50 py-1 px-2 rounded-full mx-auto w-max">
                  Note: One-time access only
                </span>
              </p>

              {error && (
                <div className="bg-red-50 text-red-500 text-sm mb-4 p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button 
                onClick={handleUnlockDemo}
                className="w-full bg-[#024aac] text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg hover:shadow-blue-500/25"
              >
                Confirm & Unlock
              </button>
            </div>
          </div>
        </div>
      )}
                  </div>
                )}

                {/* TESTIMONIALS */}
                {reviews && reviews.length > 0 && (
                  <div className="bg-white rounded-[1.5rem] p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                      <Quote className="text-[#5186cd] fill-[#e9f1fb] rotate-180 w-6 h-6 sm:w-8 sm:h-8" />
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Student Testimonials</h2>
                    </div>
                    <p className="text-slate-500 mb-4 sm:mb-6 text-xs sm:text-sm px-2">What our students say about their learning experience</p>

                    <div className="w-full bg-[#F8FAFC] rounded-[1.5rem] p-4 sm:p-6 shadow-sm border border-slate-100 text-left relative transition-all duration-300">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[3px] border-blue-400 p-0.5 shrink-0">
                          {reviews[currentReviewIdx]?.studentId?.profile?.avatar || reviews[currentReviewIdx]?.studentId?.profile?.imageUrl ? (
                            <img src={reviews[currentReviewIdx].studentId.profile.avatar || reviews[currentReviewIdx].studentId.profile.imageUrl} alt="Student" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-400"><User size={20} /></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-base sm:text-lg leading-tight">
                            {reviews[currentReviewIdx]?.studentName || "Student"}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-slate-500 mb-1">Learner</p>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={`sm:w-3.5 sm:h-3.5 ${i < (reviews[currentReviewIdx]?.rating || 5) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 italic text-sm sm:text-[15px] leading-relaxed">
                        "{reviews[currentReviewIdx]?.comment || "Great experience learning with this trainer. Highly recommended!"}"
                      </p>
                    </div>

                    {reviews.length > 1 && (
                      <div className="flex justify-center gap-2 mt-4 sm:mt-5">
                        {reviews.map((_, idx) => (
                          <button key={idx} onClick={() => setCurrentReviewIdx(idx)} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${idx === currentReviewIdx ? 'bg-[#5186cd] w-3 sm:w-4' : 'bg-slate-400 hover:bg-slate-500'}`} aria-label={`Go to review ${idx + 1}`} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: GROUP & PRIVATE */}
            {activeTab === 'group' && (
              <div className="bg-white rounded-[1.5rem] p-5 sm:p-8 shadow-sm border border-slate-100 animate-fade-in">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800 border-b pb-3 sm:pb-4">Group Sessions</h3>
                <BookGroupSession trainerId={trainer._id} />
              </div>
            )}

            {activeTab === 'private' && (
              <div className="bg-white rounded-[1.5rem] p-5 sm:p-8 shadow-sm border border-slate-100 animate-fade-in">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800 border-b pb-3 sm:pb-4">1-on-1 Private Session</h3>
                <BookPrivateSession trainerId={trainer._id} rates={trainer?.profile?.privateSessionRate} />
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default TrainerProfile