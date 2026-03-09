// FILE: src/components/TrainerCard.tsx
import React, { useEffect, useRef, useState } from 'react'
import { Play, User, Star, Clock, MapPin, X, Heart } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import * as Flags from 'country-flag-icons/react/3x2'
import Price from './Price'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'

const renderFlag = (code?: string) => {
  if (!code) return null
  const upper = code.toUpperCase()
  const Flag = (Flags as any)[upper]
  if (!Flag) return null
  return (
    <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm border border-[#5186cd]/20">
      <Flag title={upper} className="w-full h-full object-cover" />
    </div>
  )
}

interface Props { trainer: any; learningType: string; sessionMode: string; }

const TrainerCard: React.FC<Props> = ({ trainer, learningType, sessionMode }) => {
  type AnyObj = Record<string, any>;
  const [openVideo, setOpenVideo] = useState(false)
  const { user } = useAuth() as AnyObj;
  const [fav, setFav] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const navigate = useNavigate()
  const [previewLink, setPreviewLink] = useState<string>("")
 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const avatar = trainer.profile?.imageUrl || trainer.profile?.avatar || ''
  const rating = (trainer.stats?.rating ?? trainer.profile?.averageRating) || 0
  const reviews = trainer.profile?.totalBookings || 0

  const languagesList =
    Array.isArray(trainer.profile?.trainerLanguages) && trainer.profile!.trainerLanguages!.length > 0
      ? trainer.profile!.trainerLanguages!.slice(0, 3).map((tl: any) => tl.language || '')
      : Array.isArray(trainer.profile?.languages)
        ? trainer.profile!.languages!.slice(0, 3)
        : []

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


  return (
    <article
      className="bg-white rounded-[36px] p-6 shadow-[4px_4px_0px_0px_rgba(81,134,205,0.35)]
                 hover:shadow-[6px_6px_0px_0px_rgba(81,134,205,0.45)]
                 transition-all duration-200 border border-[#5186cd]/15 flex flex-col"
      style={{ minHeight: 360 }}
    >

      {/* Top Media */}
      {trainer.profile?.demoVideo ? (
        <div className="mb-5 relative rounded-2xl overflow-hidden bg-[#e9f1fb]">
          {!openVideo ? (
            <>
              <div className="w-full h-44 flex items-center justify-center overflow-hidden">
                {previewLink
                  ? <img src={previewLink} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover brightness-90" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
              </div>

              <button
                onClick={() => setOpenVideo(true)}
                className="absolute inset-0 flex items-center justify-center"
                aria-label="Play demo"
              >
                <div className="bg-white/95 hover:bg-white p-4 rounded-full shadow-xl border border-[#5186cd]/20">
                  <Play className="h-6 w-6 text-[#5186cd]" />
                </div>
              </button>
            </>
          ) : (
            <>
              <div className="w-full h-44 bg-black">
                <video ref={el => videoRef.current = el} src={trainer.profile.demoVideo} controls playsInline className="w-full h-full object-cover" />
              </div>
              <button
                onClick={() => setOpenVideo(false)}
                className="absolute top-3 right-3 bg-white/95 hover:bg-white rounded-full p-2 shadow border border-[#5186cd]/20"
                aria-label="Close video"
              >
                <X className="h-4 w-4 text-[#5186cd]" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="mb-5 w-full h-44 bg-[#e9f1fb] rounded-2xl overflow-hidden flex items-center justify-center">
          {previewLink
            ? <img src={previewLink} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
            : <User className="h-10 w-10 text-[#5186cd]" />}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 bg-[#e9f1fb] rounded-xl flex items-center justify-center overflow-hidden border border-[#5186cd]/20">
            {previewLink
              ? <img src={previewLink} alt={trainer.name || 'Trainer'} className="w-full h-full object-cover" />
              : <User className="h-6 w-6 text-[#5186cd]" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {renderFlag(trainer.profile?.nationalityCode)}
              <h3 className="text-lg font-bold text-[#1f2937] truncate">
                {trainer.name || 'Unnamed Trainer'}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
              <span className="inline-flex items-center gap-1 bg-[#fef5e4] text-[#5186cd] px-2 py-0.5 rounded-full text-sm border border-[#5186cd]/20">
                <Star className="h-4 w-4" />
                {Number(rating).toFixed(1)}
              </span>
              <span className="text-gray-500">({reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* <div className="px-3 py-1 bg-[#5186cd] text-white rounded-full font-semibold text-sm">
          <Price amount={Number(trainer.profile?.hourlyRate || 25)} /> /hr
        </div> */}
      </div>

      {/* Learning Type Tags */}
      {learningType === 'language' && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1 font-medium">🌐 Languages I Teach</p>
          <div className="flex flex-wrap gap-2">
            {languagesList.map((l: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-white border border-[#5186cd]/20 rounded-full text-sm text-[#1f2937]">
                {l}
              </span>
            ))}
          </div>
        </div>
      )}

      {learningType === 'subject' && trainer.profile?.specializations?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1 font-medium">📚 Subjects I Teach</p>
          <div className="flex flex-wrap gap-2">
            {trainer.profile.specializations.slice(0, 4).map((s: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-[#e9f1fb] border border-[#5186cd]/20 rounded-full text-sm text-[#5186cd]">
                {s}
              </span>
            ))}
            {trainer.profile.specializations.length > 4 && (
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                +{trainer.profile.specializations.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {learningType === 'hobby' && (() => {
        const hobbies = trainer.profile?.hobbies || trainer.profile?.interests || trainer.profile?.skills || []
        return hobbies.length > 0
      })() && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1 font-medium">🎨 Hobbies I Teach</p>
            <div className="flex flex-wrap gap-2">
              {(trainer.profile?.hobbies || trainer.profile?.interests || trainer.profile?.skills || []).slice(0, 4).map((h: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-[#e9f1fb] border border-[#5186cd]/20 rounded-full text-sm text-[#5186cd]">
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

      {/* Bio */}
      <p className="text-gray-600 mb-5 line-clamp-3 flex-1">
        {trainer.profile?.bio || 'Experienced trainer helping students achieve fluency through personalized lessons.'}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-6 text-gray-600 mb-5">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-[#5186cd]" />
          <span>{Number(trainer.profile?.experience || 5)}+ years</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-[#5186cd]" />
          <span>{trainer.profile?.location || 'Online'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-wrap gap-3 justify-between items-center">
        <button
          onClick={() => setFav(f => !f)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition
            ${fav
              ? 'bg-red-100 border-red-300 text-red-600'
              : 'border-[#5186cd]/20 text-gray-600 hover:bg-[#e9f1fb]'
            }`}
        >
          <Heart className="h-5 w-5" />
          {fav ? 'Liked' : 'Like'}
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to={`/trainer-profile/${trainer._id}`}
            state={{ learningType: learningType }}
            className="px-4 py-2 bg-white border border-[#5186cd]/20 text-[#5186cd] rounded-full font-semibold hover:bg-[#e9f1fb] text-center transition"
          >
            View Profile
          </Link>

          <button
            onClick={() => {
              const tabToOpen = sessionMode === 'group' ? 'group' : 'private'
              navigate(`/trainer-profile/${trainer._id}`, {
                state: { 
                  learningType: learningType, 
                  activeTab: tabToOpen 
                }
              })
            }}
            className="px-4 py-2 bg-[#5186cd] text-white rounded-full font-semibold hover:bg-[#3f6fb0] text-center transition"
          >
            Book Now
          </button>
        </div>
      </div>

    </article>
  )
}

export default React.memo(TrainerCard)
