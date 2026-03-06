// src/pages/student/StudentProfile.tsx
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'

/* ---------- Types ---------- */
type AnyObj = Record<string, any>

/* ---------------- StudentProfile ---------------- */
const StudentProfile: React.FC = () => {
  const { user, updateProfile } = useAuth() as AnyObj
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

  const [previewLink, setPreviewLink] = useState<string>("")
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [originalImageKey, setOriginalImageKey] = useState<string>("")

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
    <div className="space-y-6 max-w-[900px] mx-auto">
      <div className="rounded-2xl p-8 bg-white shadow-xl border border-gray-100 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-[#2D274B] mb-6">
          My Profile
        </h2>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Image
            </label>

            <div className="flex items-start gap-4">
              <div className="w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                {previewLink ? (
                  <img
                    src={previewLink}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="url"
                  id="profile.imageUrl"
                  name="profile.imageUrl"
                  value={formData.profile.imageUrl}
                  onChange={handleChange}
                  placeholder="Paste image URL (or upload below)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
                />

                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="px-4 py-2 rounded-lg bg-gray-100 border text-sm hover:bg-gray-200">
                      Upload Image
                    </span>
                  </label>

                  {formData.profile.imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm border hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg  cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-medium text-sm"
              />
            </div>

            {/* secondary email Removed */}

          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="profile.bio"
              name="profile.bio"
              value={formData.profile.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
            />
          </div>

          {/* Contact + Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="profile.phone"
                value={formData.profile.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="profile.location"
                value={formData.profile.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Education Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Highest Qualification
              </label>
              <input
                type="text"
                name="profile.highestQualification"
                value={formData.profile.highestQualification}
                onChange={handleChange}
                placeholder="e.g. B.Sc. Computer Science"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College / University
              </label>
              <input
                type="text"
                name="profile.collegeName"
                value={formData.profile.collegeName}
                onChange={handleChange}
                placeholder="College or University name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9787F3] transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#9787F3] text-white rounded-lg hover:bg-[#8a75f0] font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentProfile