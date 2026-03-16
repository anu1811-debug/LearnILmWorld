// src/pages/student/StudentProfile.tsx
import React, { useEffect, useState, ChangeEvent, FormEvent, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Camera, MapPin, User } from 'lucide-react'
import PreferenceTab from './PreferenceTab'

/* ---------- Types ---------- */
type AnyObj = Record<string, any>

/* ---------------- StudentProfile ---------------- */
const StudentProfile: React.FC = () => {
  const { user, updateProfile } = useAuth() as AnyObj
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // secondaryEmail: '',
    profile: {
      bio: '',
      languages: [] as string[],
      phone: '',
      location: '',
      imageUrl: '',
      highestQualification: '',
      collegeName: ''
    }
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
const [isEditingPhoto, setIsEditingPhoto] = useState(false)
  const [previewLink, setPreviewLink] = useState<string>("")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [originalImageKey, setOriginalImageKey] = useState<string>("")

  const [activeTab, setActiveTab] = useState('Basic Info')
  const tabs = ['Basic Info', 'Preference', 'Security']

  useEffect(() => {
    if (!user) return

    setFormData(prev => ({
      ...prev,
      name: user.name || prev.name || '',
      email: user.email || prev.email || '',
      profile: {
        ...prev.profile,
        bio: user?.profile?.bio || '',
        languages: user?.profile?.languages || [],
        phone: user?.profile?.phone || '',
        location: user?.profile?.location || '',
        imageUrl: user?.profile?.imageUrl || '',
        highestQualification: user?.profile?.highestQualification || '',
        collegeName: user?.profile?.collegeName || ''
      }
    }))

    // Capture Original Image Key (for deletion logic)
    const dbImage = user?.profile?.imageUrl;
    if (dbImage && !dbImage.startsWith("blob:") && !dbImage.startsWith("data:")) {
      console.log("INITIAL LOAD - Found existing image:", dbImage);
      setOriginalImageKey(dbImage);
    }
  }, [user])

  //MANAGE PREVIEW LINK (Secure R2 Access)
  useEffect(() => {
    const getPreview = async () => {
      const currentImage = formData.profile.imageUrl;

      if (!currentImage) {
        setPreviewLink("");
        return;
      }
      if (currentImage.startsWith('blob:') || currentImage.startsWith('data:')) {
        setPreviewLink(currentImage);
        return;
      }
      if (currentImage.startsWith('http')) {
        setPreviewLink(currentImage);
        return;
      }
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-download-url`, {
          fileKey: currentImage
        });
        setPreviewLink(data.signedUrl);
      } catch (err) {
        console.error("Preview failed", err);
      }
    };

    getPreview();
  }, [formData.profile.imageUrl, API_BASE_URL]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'profile.imageUrl') {
      setSelectedImageFile(null);
    }
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return

    setSelectedImageFile(file)
    const localPreviewUrl = URL.createObjectURL(file)

    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        imageUrl: localPreviewUrl
      }
    }))
  }


  const handleRemoveImage = () => {
    setSelectedImageFile(null)
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        imageUrl: ''
      }
    }))
    setPreviewLink("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!formData.name?.trim()) {
      setError('Full name is required')
      setLoading(false)
      return
    }

    // if (formData.secondaryEmail) {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    //   if (!emailRegex.test(formData.secondaryEmail)) {
    //     setError('Secondary email is invalid')
    //     setLoading(false)
    //     return
    //   }
    // }


    try {
      let finalImageKey = formData.profile.imageUrl;

      //check that's the link is new https image
      const isNewHttpLink = finalImageKey.startsWith("http") && finalImageKey !== originalImageKey;

      // handle url image
      if (finalImageKey.startsWith("data:") || isNewHttpLink) {
        try {
          console.log("Detecting Base64 image, converting...");
          const res = await fetch(finalImageKey);
          if (!res.ok) throw new Error("Network response was not ok");
          const blob = await res.blob();
          const fileType = blob.type || "image/jpeg";
          const fileName = `student-pasted-${Date.now()}.jpg`;

          // Get Upload URL
          const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-upload-url`, {
            fileName,
            fileType,
            folderMain: 'students'
          });

          // Upload to R2
          await fetch(data.uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: { 'Content-Type': fileType },
          });

          finalImageKey = data.key;

        } catch (err) {
          console.error("Failed to process pasted image", err);
          setError("Failed to upload the pasted image.");
          setLoading(false);
          return;
        }
      }
      //STANDARD FILE UPLOAD
      else if (selectedImageFile) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-upload-url`, {
            fileName: selectedImageFile.name,
            fileType: selectedImageFile.type,
            folderMain: 'students'
          });

          await fetch(data.uploadUrl, {
            method: 'PUT',
            body: selectedImageFile,
            headers: { 'Content-Type': selectedImageFile.type },
          });

          finalImageKey = data.key;
        } catch (uploadErr) {
          console.error("Upload failed", uploadErr);
          setError("Failed to upload image.");
          setLoading(false);
          return;
        }
      }

      // Safety: Prevent saving "blob:" URLs to database
      if (finalImageKey.startsWith("blob:")) {
        setError("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
      const payload = {
        name: formData.name,
        // secondaryEmail: formData.secondaryEmail,
        profile: {
          bio: formData.profile.bio,
          languages: formData.profile.languages,
          phone: formData.profile.phone,
          location: formData.profile.location,
          imageUrl: finalImageKey,
          highestQualification: formData.profile.highestQualification,
          collegeName: formData.profile.collegeName
        }
      }

      const result = await updateProfile?.(payload)

      // DELETE OLD IMAGE
      if (result?.success) {
        setSuccess('Profile updated successfully!')

        if (originalImageKey && originalImageKey !== finalImageKey) {
          const isR2File = !originalImageKey.startsWith("http") && !originalImageKey.startsWith("https") && !originalImageKey.startsWith("data:");
          if (isR2File) {
            console.log("Deleting old R2 file:", originalImageKey);
            try {
              await axios.delete(`${API_BASE_URL}/api/upload/delete-file`, {
                data: { fileKey: originalImageKey }
              });
            } catch (delErr) { console.error("Delete failed", delErr); }
          }
        }
        setOriginalImageKey(finalImageKey);
        setSelectedImageFile(null);

      } else {
        setError(result?.error || 'Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="w-full pb-10">
      
      {/* Top Profile Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden transition-all">
        <div className="p-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
            
            {/* Avatar with Camera Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                {previewLink ? (
                  <img src={previewLink} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className='text-blue-600'/>
                )}
              </div>
              
              {/* Camera Icon - Toggles the inline edit mode */}
              <button 
                type="button"
                onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border border-gray-200 shadow-sm flex items-center justify-center transition-colors ${isEditingPhoto ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-50 text-gray-600'}`}
              >
                {isEditingPhoto ? (
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <Camera className='w-4 h-4'/>
                )}
              </button>
              
              {/* Hidden File Input */}
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            {/* Profile Info OR Photo Edit Controls */}
            <div className="flex-1 w-full max-w-lg min-h-[80px] flex flex-col justify-center">
              {isEditingPhoto ? (
                // --- INLINE PHOTO EDITING MODE ---
                <div className="space-y-3 animate-fade-in">
                  <input
                    type="url"
                    name="profile.imageUrl"
                    value={formData.profile.imageUrl}
                    onChange={handleChange}
                    placeholder="Enter Image URL"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm text-gray-700"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                    >
                      Update Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-5 py-2 bg-[#fadcdb] hover:bg-[#f5c6c5] text-[#d65551] rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPhoto(false)}
                      className="ml-auto px-5 py-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors underline"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                // --- DEFAULT PROFILE INFO MODE ---
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'Student Name'}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                      Learner
                    </span>
                    <span className="flex items-center text-gray-500 text-sm gap-1">
                      <MapPin className='w-4 h-4'/>
                      {formData.profile.location || 'Add Location'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-6 border-t border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50 rounded-t-lg'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      {activeTab === 'Basic Info' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}
{activeTab === 'Basic Info' && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-lg text-gray-700 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="profile.phone"
                  value={formData.profile.phone}
                  onChange={handleChange}
                  placeholder="+91567124567"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 border-none rounded-lg text-gray-700 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="profile.location"
                  value={formData.profile.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              {/* Highest Qualification */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">Highest Qualification</label>
                <input
                  type="text"
                  name="profile.highestQualification"
                  value={formData.profile.highestQualification}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
              </div>

              {/* College Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">College / University</label>
                <input
                  type="text"
                  name="profile.collegeName"
                  value={formData.profile.collegeName}
                  onChange={handleChange}
                  placeholder="University name"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* About Me / Bio */}
            <div className="mt-8">
              <label className="block text-sm text-gray-700 mb-2">About Me</label>
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us a bit about yourself and your learning journey..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
              <button
                type="button"
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[130px]"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
          )}

        </div>
      )}
      {activeTab === 'Preference' && (
<PreferenceTab user={user} updateProfile={updateProfile} />
)}
    </div>
  )
}

export default StudentProfile