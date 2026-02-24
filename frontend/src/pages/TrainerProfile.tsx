import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  User, Star, Globe, Award, MapPin, Calendar,
  Play, Instagram, Youtube, Linkedin, ArrowLeft, MessageSquare,
  Book,
  BookOpen,
  LoaderIcon
} from 'lucide-react'
import axios from 'axios'
import bg_img from '../assets/bg_main.jpeg'
import Price from '../components/Price'
import CurrencySelector from '../components/CurrencySelector'

interface Trainer {
  _id: string
  name: string
  email: string
  profile: {
    bio: string
    languages: string[]
    trainerLanguages: Array<{
      language: string
      proficiency: string
      teachingLevel: string[]
    }>
    experience: number
    hourlyRate: number
    avatar?: string
    imageUrl?: string
    phone?: string
    location?: string
    specializations: string[]
    certifications: Array<{
      name: string
      issuer: string
      year: number
    }>
    availability: Array<{
      day: string
      startTime: string
      endTime: string
      available: boolean
    }>
    demoVideo?: string
    socialMedia: {
      instagram?: string
      youtube?: string
      linkedin?: string
    }
    teachingStyle?: string
    studentAge?: string[]
    isAvailable?: boolean
    totalBookings?: number
    averageRating?: number
  }
  stats: {
    rating?: number
    totalSessions?: number
    completedSessions?: number
  }
}

interface Review {
  _id: string
  rating: number
  comment: string
  studentName: string
  createdAt: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainerProfile: React.FC = () => {
  const { trainerId } = useParams<{ trainerId: string }>()
  const [trainer, setTrainer] = useState<Trainer | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewLink, setPreviewLink] = useState<string>("")
  // prefer uploaded imageUrl, then avatar, then show icon
  const avatar = trainer?.profile?.imageUrl || trainer?.profile?.avatar || ''
  
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!avatar) {
        setPreviewLink(""); 
        return;
      }
      
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-download-url`, {
          fileKey: avatar 
        });
        setPreviewLink(data.signedUrl);
      } catch (err) {
        console.error("Failed to load profile image", err);
      }
    };

    fetchProfileImage();
  }, [avatar, API_BASE_URL]);

  useEffect(() => {
    if (trainerId) {
      fetchTrainerProfile()
      fetchReviews()
    }
  }, [trainerId])

  const fetchTrainerProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile/${trainerId}`)
      setTrainer(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load trainer profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reviews/trainer/${trainerId}`)
      setReviews(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error(err)
    }
  }

  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return ''
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`
    }
    return url.includes('embed') ? url : ''
  }

  const formatAvailability = () => {
    if (!trainer?.profile?.availability) return []
    return trainer.profile.availability
      .filter(slot => slot.available)
      .map(slot => ({
        day: slot.day.charAt(0).toUpperCase() + slot.day.slice(1),
        time: `${slot.startTime} - ${slot.endTime}`
      }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-pale)] flex items-center justify-center">
        <div className="dots">
          <div></div><div></div><div></div>
        </div>
      </div>
    )
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-[var(--bg-pale)] flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trainer not found</h2>
          <Link
            to="/main"
            className="px-6 py-3 bg-[#9787F3] text-white rounded-lg font-semibold hover:bg-[#9787F3]/90 transition text-base"
          >
            Browse Trainers
          </Link>
        </div>
      </div>
    )
  }

  
  // type AnyObj = Record<string, any>;
  // const { user } = useAuth() as AnyObj;
  

  return (
    <div
      className="min-h-screen font-inter text-[#2D274B] transition-colors duration-500 bg-[#FFFAF1] bg-fixed"
      style={{
        backgroundImage:
          `url(${bg_img})`,
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <div>
                <div className="text-lg font-semibold">LearniLM🌎World</div>
                <div className="text-xs text-slate-500 -mt-1">Live lessons · Micro-courses</div>
              </div>
            </Link>
            <Link
              to="/main"
              className="flex items-center text-gray-700 hover:text-[var(--accent-orange)] transition-colors font-medium text-base"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Trainers
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl font-sans mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 grid lg:grid-cols-3 gap-8">
        {/* Left: Profile, Languages, Connect, Demo Video */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Card */}
          <div className="rounded-2xl p-8 bg-white/90 backdrop-blur-md shadow-[0_20px_45px_rgba(45,39,75,0.12)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">

              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#9787F3] to-[#7C6CF2] overflow-hidden flex items-center justify-center shadow-md">

                  {previewLink ? (
                    <img
                      src={previewLink}
                      alt={trainer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{trainer.name}</h1>
                  <div className="flex items-center gap-2 mt-1 text-lg">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">
                      {trainer.stats?.rating ?? trainer.profile?.averageRating ?? 0}
                    </span>
                    <span className="text-gray-500">({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-700  mt-1">
                    <MapPin className="h-5 w-5" />
                    <span>{trainer.profile?.location || 'Online'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <CurrencySelector />
                <div className="text-3xl font-bold text-orange-500 mt-1">
                  <Price amount={trainer.profile?.hourlyRate ?? 0} /> / hr

                </div>
                <Link
                  to={`/book/${trainer._id}`}
                  className="mt-4 inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#9787F3] to-[#7C6CF2] hover:opacity-90 transition shadow-md"
                >
                  Book Session
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-5 rounded-xl text-center bg-gradient-to-b from-white to-[#F6F3FF] shadow-sm">
                <div className="text-2xl font-bold text-[#9787F3]">
                  {trainer.profile?.experience ?? 0}+
                </div>
                <div className="text-sm text-gray-600 mt-1">Years</div>
              </div>
              <div className="p-5 rounded-xl text-center bg-gradient-to-b from-white to-[#F6F3FF] shadow-sm">
                <div className="text-2xl font-bold text-[#9787F3]">
                  {trainer.stats?.completedSessions ?? 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Completed</div>
              </div>
              <div className="p-5 rounded-xl text-center bg-gradient-to-b from-white to-[#F6F3FF] shadow-sm">
                <div className="text-2xl font-bold text-[#9787F3]">
                  {trainer.profile?.totalBookings ?? 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">Students</div>
              </div>
            </div>

            {/* About */}
            <h3 className="text-2xl font-semibold text-[var(--text)] mb-3">About Me</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {trainer.profile?.bio || 'Experienced language trainer helping students achieve fluency through personalized lessons.'}
            </p>
          </div>

          {/* Languages */}
          <div className="rounded-2xl p-6 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_rgba(45,39,75,0.1)]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-500" />
              Languages I Teach
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              {trainer.profile?.trainerLanguages && trainer.profile.trainerLanguages.length > 0
                ? trainer.profile.trainerLanguages.map((lang, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl bg-gradient-to-b from-white to-[#F6F3FF] shadow-sm"

                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-[var(--text)] text-base">{lang.language}</h4>
                      <span className="px-3 py-1 bg-[#9787F3] text-white rounded-full text-sm">
                        {lang.proficiency}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {lang.teachingLevel.map((level, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[var(--accent-orange)]/20 text-gray-800 rounded-md text-sm"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
                : trainer.profile?.languages?.map((language, index) => (
                  <div key={index} className="p-4 bg-[var(--bg-pale-top)] rounded-lg">
                    <h4 className="font-semibold text-[var(--text)] text-base">{language}</h4>
                  </div>
                ))}
            </div>
          </div>

          {/* Connect Section */}
          <div className="rounded-2xl p-6 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_rgba(45,39,75,0.1)]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LoaderIcon className='h-5 w-5 text-orange-500' />
              Connect</h3>
            <div className="flex gap-4">
              {trainer.profile?.socialMedia?.instagram && (
                <a
                  href={trainer.profile.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {trainer.profile?.socialMedia?.youtube && (
                <a
                  href={trainer.profile.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              )}
              {trainer.profile?.socialMedia?.linkedin && (
                <a
                  href={trainer.profile.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>

          {/* Demo Video */}
          {trainer.profile?.demoVideo && (
            <div className="rounded-2xl p-6 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_rgba(45,39,75,0.1)]">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Play className="h-5 w-5 text-orange-500" />
                Demo Video
              </h3>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={getYouTubeEmbedUrl(trainer.profile.demoVideo)}
                  title="Trainer Demo Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Specializations, Availability, Teaching Style, Reviews */}
        <div className="space-y-8">
          {/* Specializations */}
          {trainer.profile?.specializations && trainer.profile.specializations.length > 0 && (
            <div className="rounded-2xl p-6 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_rgba(45,39,75,0.1)]">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-500" />
                Specializations
              </h3>
              <div className="flex flex-wrap gap-3">
                {trainer.profile.specializations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[#9787F3]/20 text-[var(--accent-orange)] rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          <div className="rounded-2xl p-6 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_rgba(45,39,75,0.1)]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Availability
            </h3>
            <div className="space-y-2 text-sm">
              {formatAvailability().length > 0 ? (
                formatAvailability().map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 bg-[var(--bg-pale-top)] rounded-md text-base"
                  >
                    <span className="font-medium text-[var(--text)]">{slot.day}</span>
                    <span className="text-gray-700">{slot.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-700 text-base">Available by appointment</p>
              )}
            </div>
          </div>

          {/* Teaching Style */}
          <div className="rounded-2xl p-6 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_rgba(45,39,75,0.1)]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-500" />
              Teaching Style</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              {trainer.profile?.teachingStyle || 'Structured, conversational, and outcome-focused.'}
            </p>
            {trainer.profile?.studentAge && trainer.profile.studentAge.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {trainer.profile.studentAge.map((age, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[var(--accent-orange)]/20 text-gray-800 rounded-md text-sm"
                  >
                    {age}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="rounded-2xl p-6 bg-white/90 backdrop-blur-md shadow-[0_16px_35px_rgba(45,39,75,0.1)]">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              Student Reviews ({reviews.length})
            </h3>
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-3 bg-[var(--bg-pale-top)] rounded-lg text-base"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <div className="font-semibold text-[var(--text)]">{review.studentName}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-base">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-700 text-base">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainerProfile
