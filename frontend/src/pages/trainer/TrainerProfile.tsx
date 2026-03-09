// src/pages/trainer/TrainerProfile.tsx
import { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ReactFlagsSelect from "react-flags-select";
import axios from "axios";
import ManageClasses from "../../components/ManageClasses";
//  commented out trainers hourly rate

// const FRONTEND_URL= import.meta.env.VITE_FRONTEND_URL;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ---------- TrainerProfile (form) ---------- */
const TrainerProfile = () => {
  const { user, updateProfile } = useAuth();
  const CURRENT_YEAR = new Date().getFullYear();
  const [originalCertKeys, setOriginalCertKeys] = useState<string[]>([]);
  const [certPreviews, setCertPreviews] = useState<Record<number, string>>({});

  const defaultProfile = {
    bio: user?.profile?.bio || "",
    imageUrl: user?.profile?.imageUrl || "",
    avatar: user?.profile?.avatar || "",
    languages: Array.isArray(user?.profile?.languages)
      ? [...user.profile.languages]
      : [],
    trainerLanguages: Array.isArray(user?.profile?.trainerLanguages)
      ? [...user.profile.trainerLanguages]
      : [],
    hobbies: Array.isArray(user?.profile?.hobbies)
      ? [...user.profile.hobbies]
      : [],
    experience: user?.profile?.experience ?? 0,
    nationalityCode: user?.profile?.nationalityCode || "",
    standards: Array.isArray(user?.profile?.standards)
      ? [...user.profile.standards]
      : [],
    hourlyRate: user?.profile?.hourlyRate ?? 25,
    // pricing: user?.profile?.pricing || { min30: 25, min60: 45, min90: 65 },
    phone: user?.profile?.phone || "",
    location: user?.profile?.location || "",
    timezone: user?.profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    specializations: Array.isArray(user?.profile?.specializations)
      ? [...user.profile.specializations]
      : [],
    certifications: Array.isArray(user?.profile?.certifications)
      ? user.profile.certifications.map((cert: any) => ({
        name: cert.name || "",
        issuer: cert.issuer || "",
        year: cert.year || null,
        certificateImage: cert.certificateImage || "",
        certificateLink: cert.certificateLink || "",
      }))
      : [],
    availability: Array.isArray(user?.profile?.availability)
      ? [...user.profile.availability]
      : [],
    profileImages: Array.isArray(user?.profile?.profileImages)
      ? [...user.profile.profileImages]
      : [],
    socialMedia: {
      instagram:
        (user?.profile?.socialMedia &&
          (user.profile.socialMedia.get
            ? user.profile.socialMedia.get("instagram")
            : user.profile.socialMedia.instagram)) ||
        "",
      youtube:
        (user?.profile?.socialMedia &&
          (user.profile.socialMedia.get
            ? user.profile.socialMedia.get("youtube")
            : user.profile.socialMedia.youtube)) ||
        "",
      linkedin:
        (user?.profile?.socialMedia &&
          (user.profile.socialMedia.get
            ? user.profile.socialMedia.get("linkedin")
            : user.profile.socialMedia.linkedin)) ||
        "",
    },
    teachingStyle: user?.profile?.teachingStyle || "Conversational",
    studentAge: Array.isArray(user?.profile?.studentAge)
      ? [...user.profile.studentAge]
      : [],
    demoVideo: user?.profile?.demoVideo || "",
    isAvailable: user?.profile?.isAvailable ?? true,
    totalBookings: user?.profile?.totalBookings ?? 0,
    averageRating: user?.profile?.averageRating ?? 5.0,
  };

  type ProfileType = typeof defaultProfile;

  const certFields = [
    { key: "name", type: "text", placeholder: "Certification Name" },
    { key: "issuer", type: "text", placeholder: "Issuer" },
    {
      key: "year", type: "number", placeholder: "Year",
      min: 1950, max: CURRENT_YEAR,
    },
    {
      key: "certificateLink", type: "url",
      placeholder: "https://certificate-link.com",
    },
  ];

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    profile: ProfileType;
  }>({
    name: user?.name || "",
    email: user?.email || "",
    profile: defaultProfile,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newHobby, setNewHobby] = useState("");
  const [previewLink, setPreviewLink] = useState<string>(""); //for preview of the image
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null); //for viewing the image without upload
  const [originalImageKey, setOriginalImageKey] = useState<string>("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [newStandard, setNewStandard] = useState("");

  // Availability useeffect
  useEffect(() => {
    // ensure availability has 7 days (preserve existing)
    const ALL_DAYS = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const existing = (formData.profile.availability || []).reduce((acc, a) => {
      if (a && a.day) acc[a.day] = a;
      return acc;
    }, {});
    const availability = ALL_DAYS.map(
      (d) =>
        existing[d] || {
          day: d,
          startTime: null,
          endTime: null,
          available: false,
        },
    );
    if ((formData.profile.availability || []).length < 7) {
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, availability },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- Generic handlers --- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // Checkbox handler
    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: isChecked }));
      return;
    }

    // Social media: profile.socialMedia.youtube, .linkedin, etc.
    if (name.startsWith("profile.socialMedia.")) {
      const key = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          socialMedia: {
            ...prev.profile.socialMedia,
            [key]: value,
          },
        },
      }));
      return;
    }

    // Other profile fields
    if (name.startsWith("profile.")) {
      const key = name.replace("profile.", "");
      const parsed =
        key === "experience" || key === "hourlyRate"
          ? parseFloat(value) || 0
          : value;

      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [key]: parsed,
        },
      }));
      return;
    }

    // Top-level fields (name, email)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addToArray = (field: keyof typeof defaultProfile, value: any) => {
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: [...(prev.profile[field] || []), value],
      },
    }));
  };
  const removeFromArray = (
    field: keyof typeof defaultProfile,
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: (prev.profile[field] || []).filter(
          (_: any, i: number) => i !== index,
        ),
      },
    }));
  };

  const updateObjectInArray = (
    field: keyof typeof defaultProfile,
    index: number,
    subfield: string,
    value: any,
  ) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.profile[field])
        ? [...prev.profile[field]]
        : [];
      arr[index] = { ...arr[index], [subfield]: value };
      return { ...prev, profile: { ...prev.profile, [field]: arr } };
    });
  };

  const addComplexToArray = (field: keyof typeof defaultProfile, obj: any) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: [...(prev.profile[field] || []), obj],
      },
    }));
  };

  const updateTrainerLangLevels = (index: number, value: string) => {
    const levels = String(value)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateObjectInArray("trainerLanguages", index, "teachingLevel", levels);
  };

  const updateAvailability = (index: number, subfield: string, value: any) => {
    setFormData((prev) => {
      const arr = Array.isArray(prev.profile.availability)
        ? [...prev.profile.availability]
        : [];
      arr[index] = { ...arr[index], [subfield]: value };
      // if available turned off, clear times
      if (subfield === "available" && !value) {
        arr[index].startTime = null;
        arr[index].endTime = null;
      }
      return { ...prev, profile: { ...prev.profile, availability: arr } };
    });
  };

  useEffect(() => {
    if (user?.profile) {

      // Capture original certification keys
      if (user.profile.certifications) {
        const keys = user.profile.certifications
          .map((c: any) => c.certificateImage)
          .filter((k: string) => k && !k.startsWith("http"));
        setOriginalCertKeys(keys);
      }
      // Capture the Original Profile Image Key
      const dbImage = user.profile.imageUrl;
      if (dbImage && !dbImage.startsWith("blob:") && !dbImage.startsWith("data:")) {
        setOriginalImageKey(dbImage);
      }

      // If your form is empty but user data exists, sync the form
      if (formData.email === "" && user.email) {
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          profile: { ...prev.profile, ...user.profile }
        }));
      }
    }
  }, [user]);
  // for certificate useffect
  useEffect(() => {
    const loadCertPreviews = async () => {
      const previews: Record<number, string> = {};

      await Promise.all(
        (formData.profile.certifications || []).map(async (cert: any, i: number) => {
          if (
            typeof cert.certificateImage === "string" &&
            cert.certificateImage &&
            !cert.certificateImage.startsWith("http")
          ) {
            try {
              const { data } = await axios.post(
                `${API_BASE_URL}/api/upload/get-download-url`,
                { fileKey: cert.certificateImage }
              );
              previews[i] = data.signedUrl;
            } catch {
              previews[i] = "";
            }
          }
        })
      );

      setCertPreviews(previews);
    };

    loadCertPreviews();
  }, [formData.profile.certifications]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    const localPreviewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        imageUrl: localPreviewUrl,
      },
    }));
  };
  //for the image as when someone upload the image it loads
  useEffect(() => {
    const getPreview = async () => {
      const currentImage = formData.profile.imageUrl;

      if (!currentImage) {
        setPreviewLink("");
        return;
      }
      if (
        currentImage.startsWith("blob:") ||
        currentImage.startsWith("data:")
      ) {
        setPreviewLink(currentImage);
        return;
      }
      if (!currentImage.startsWith("http")) {
        try {
          const { data } = await axios.post(
            `${API_BASE_URL}/api/upload/get-download-url`,
            {
              fileKey: currentImage,
            },
          );
          setPreviewLink(data.signedUrl);
        } catch (err) {
          console.error("Preview failed", err);
        }
      } else {
        setPreviewLink(currentImage);
      }
    };

    getPreview();
  }, [formData.profile.imageUrl]);

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        imageUrl: "",
      },
    }));
    setPreviewLink("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const badCert = (formData.profile.certifications || []).some((c: any) => c.year && (c.year < 1950 || c.year > CURRENT_YEAR))
    if (badCert) {
      setError(`Certification year must be between 1950 and ${CURRENT_YEAR}`)
      setLoading(false); return
    }

    try {
      if (!user) { setError('User not found'); setLoading(false); return; }

      // UPLOAD NEW IMAGE 
      let finalImageKey = formData.profile.imageUrl;
      //check that's the link is new https image
      const isNewHttpLink = finalImageKey.startsWith("http") && finalImageKey !== originalImageKey;

      //this is when someone set the image url
      if (finalImageKey.startsWith("data:") || isNewHttpLink) {
        try {
          const res = await fetch(finalImageKey);
          if (!res.ok) throw new Error("Network response was not ok");
          const blob = await res.blob();
          const fileType = blob.type || "image/jpeg";
          const fileName = `pasted-image-${Date.now()}.jpg`;

          // 1. Get Upload URL
          const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-upload-url`, {
            fileName,
            fileType,
          });

          // Upload to R2
          await fetch(data.uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: { 'Content-Type': fileType },
          });

          // Update the key to the R2 path
          finalImageKey = data.key;

        } catch (err) {
          setError("Failed to upload the pasted image.");
          setLoading(false);
          return;
        }
      } else if (selectedImageFile) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-upload-url`, {
            fileName: selectedImageFile.name,
            fileType: selectedImageFile.type,
          });

          await fetch(data.uploadUrl, {
            method: 'PUT',
            body: selectedImageFile,
            headers: { 'Content-Type': selectedImageFile.type },
          });

          finalImageKey = data.key;
        } catch (uploadErr) {
          setError("Failed to upload image.");
          setLoading(false);
          return;
        }
      }

      // --- HANDLE CERTIFICATE UPLOADS ---
      const updatedCerts = [];

      for (const cert of formData.profile.certifications || []) {
        let imageKey = cert.certificateImage;

        // If new file selected
        if (cert.certificateImage instanceof File) {
          try {
            const { data } = await axios.post(
              `${API_BASE_URL}/api/upload/get-upload-url`,
              {
                fileName: cert.certificateImage.name,
                fileType: cert.certificateImage.type,
                folderMain: "trainers",
                folderSub: "certificates",
              }
            );

            await fetch(data.uploadUrl, {
              method: "PUT",
              body: cert.certificateImage,
              headers: { "Content-Type": cert.certificateImage.type },
            });

            imageKey = data.key;
          } catch (err) {
            setError("Failed to upload certificate image.");
            setLoading(false);
            return;
          }
        }

        updatedCerts.push({
          ...cert,
          certificateImage: imageKey,
        });
      }

      const updatedProfile = {
        ...user.profile,
        ...formData.profile,
        imageUrl: finalImageKey,
        certifications: updatedCerts,
      };

      const result = await updateProfile({
        name: formData.name,
        profile: updatedProfile
      });

      // DELETE OLD IMAGE
      if (result?.success) {
        setSuccess('Profile updated successfully!');

        // Check if we actually have an OLD key to delete
        if (originalImageKey) {

          // Check if the image has CHANGED
          if (originalImageKey !== finalImageKey) {

            // Check if the OLD image is an R2 file (not a website link)
            const isR2File = !originalImageKey.startsWith("http") && !originalImageKey.startsWith("https");

            if (isR2File) {
              console.log("Condition Met: Deleting R2 file...", originalImageKey);
              try {
                await axios.delete(`${API_BASE_URL}/api/upload/delete-file`, {
                  data: { fileKey: originalImageKey }
                });
                console.log("Old R2 file deleted!");
              } catch (delErr) {
                console.error("Delete failed", delErr);
              }
            } else {
              console.log("Skipping Delete: Old image was a public URL (Google/Brave), not an R2 file.");
            }
          } else {
            console.log("Skipping Delete: Image did not change.");
          }
        } else {
          console.log("Skipping Delete: No original image was found on load.");
        }

        // DELETE REMOVED CERTIFICATES
        const currentKeys = updatedCerts
          .map((c: any) => c.certificateImage)
          .filter((k: string) => k);

        for (const oldKey of originalCertKeys) {
          if (!currentKeys.includes(oldKey)) {
            try {
              await axios.delete(`${API_BASE_URL}/api/upload/delete-file`, {
                data: { fileKey: oldKey },
              });
              console.log("Deleted old certificate:", oldKey);
            } catch (err) {
              console.error("Failed to delete old certificate", err);
            }
          }
        }

        setOriginalCertKeys(currentKeys);

        setOriginalImageKey(finalImageKey);
        setSelectedImageFile(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
        </div>

        {/* Image: preview + URL + file upload */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Profile image
          </label>

          <div className="flex items-start gap-4">
            <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
              {previewLink ? (
                <img
                  src={previewLink}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-slate-500 px-2 text-center">
                  No image
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="url"
                id="profile.imageUrl"
                name="profile.imageUrl"
                value={formData.profile.imageUrl}
                onChange={(e) => {
                  handleChange(e);
                  setSelectedImageFile(null);
                }}
                placeholder="Paste image URL (or upload below)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5a3] focus:border-[#0ea5a3] transition-all duration-300 font-medium"
              />

              <div className="flex gap-2 items-center">
                <label className="cursor-pointer inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="px-4 py-2 rounded-lg bg-gray-100 border font-medium text-sm hover:bg-gray-200">
                    Upload image
                  </span>
                </label>

                {formData.profile.imageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="px-4 py-2 rounded-lg bg-red-50 border text-red-600 text-sm hover:bg-red-100"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-500">
                Tip: Paste an image URL or upload a file. Upload uses a local
                base64 preview — to persist, your updateProfile should accept
                image data or you should upload to storage and save resulting
                URL.
              </div>
            </div>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  className="input-field bg-gray-50"
                  disabled
                />
              </div>
              {/* secondary email Removed now */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Email</label>
                <input
                  type="email"
                  name="secondaryEmail"
                  value={formData.secondaryEmail}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter secondary email"
                />
              </div> */}

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="profile.phone"
                  value={formData.profile.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              {/* Nationality */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nationality
                </label>

                <ReactFlagsSelect
                  selected={formData.profile.nationalityCode}
                  onSelect={(code) =>
                    setFormData((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, nationalityCode: code },
                    }))
                  }
                  searchable
                  className="w-full"
                  selectButtonClassName="input-field flex items-center justify-between"
                  placeholder="Select Nationality"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  name="profile.location"
                  value={formData.profile.location}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* timezone */}
            <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  name="profile.timezone"
                  value={formData.profile.timezone}
                  onChange={handleChange}
                  className="input-field"
                >
                  {/* Intl.supportedValuesOf browser ka in-built function hai jo saare timezones ki list de deta hai */}
                  {(Intl as any).supportedValuesOf('timeZone').map((tz: string) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

            {/* bio */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="profile.bio"
                value={formData.profile.bio}
                onChange={handleChange}
                className="input-field"
                rows={4}
                placeholder="Tell students about yourself..."
              />
            </div>
          </div>

          {/* Teaching Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Teaching Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="profile.experience"
                  value={formData.profile.experience}
                  onChange={handleChange}
                  className="input-field"
                  min={0}
                  step={0.5}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teaching Style
                </label>
                <select
                  name="profile.teachingStyle"
                  value={formData.profile.teachingStyle}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option>Conversational</option>
                  <option>Grammar-focused</option>
                  <option>Immersive</option>
                  <option>Business-oriented</option>
                  <option>Exam Preparation</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Is Available for New Bookings
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="profile.isAvailable"
                    checked={!!formData.profile.isAvailable}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        profile: {
                          ...prev.profile,
                          isAvailable: e.target.checked,
                        },
                      }))
                    }
                  />
                  <span>Yes</span>
                </label>
              </div>
            </div>



            {/* Languages */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Languages
              </label>
              <ul className="space-y-2 mb-4">
                {(formData.profile.languages || []).map((lang, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeFromArray("languages", idx)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="input-field flex-1 mr-2"
                  placeholder="Add new language"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray("languages", newLanguage);
                    setNewLanguage("");
                  }}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Hobbies */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hobbies
              </label>
              <ul className="space-y-2 mb-4">
                {(formData.profile.hobbies || []).map((hobby, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    {hobby}
                    <button
                      type="button"
                      onClick={() => removeFromArray("hobbies", idx)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input
                  type="text"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  className="input-field flex-1 mr-2"
                  placeholder="Add new hobby"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray("hobbies", newHobby);
                    setNewHobby("");
                  }}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Specializations / Subjects */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specializations
              </label>
              <ul className="space-y-2 mb-4">
                {(formData.profile.specializations || []).map((spec, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeFromArray("specializations", idx)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="input-field flex-1 mr-2"
                  placeholder="Add new specialization"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray("specializations", newSpecialization);
                    setNewSpecialization("");
                  }}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Standards */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Standards (e.g., 5-8, 5-10, etc.)
              </label>

              <ul className="space-y-2 mb-4">
                {(formData.profile.standards || []).map((std, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    {std}
                    <button
                      type="button"
                      onClick={() => removeFromArray("standards", idx)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex">
                <input
                  type="text"
                  value={newStandard}
                  onChange={(e) => setNewStandard(e.target.value)}
                  className="input-field flex-1 mr-2"
                  placeholder="Add new standard (e.g., 5-8)"
                />
                <button
                  type="button"
                  onClick={() => {
                    addToArray("standards", newStandard);
                    setNewStandard("");
                  }}
                  className="btn-primary"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Trainer Languages (complex) */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trainer Languages
              </label>
              {(formData.profile.trainerLanguages || []).map((tl, idx) => (
                <div
                  key={idx}
                  className="bg-gray-100 p-4 rounded mb-4 space-y-2"
                >
                  <input
                    type="text"
                    value={tl.language || ""}
                    onChange={(e) =>
                      updateObjectInArray(
                        "trainerLanguages",
                        idx,
                        "language",
                        e.target.value,
                      )
                    }
                    className="input-field"
                    placeholder="Language"
                  />
                  <select
                    value={tl.proficiency || "Fluent"}
                    onChange={(e) =>
                      updateObjectInArray(
                        "trainerLanguages",
                        idx,
                        "proficiency",
                        e.target.value,
                      )
                    }
                    className="input-field"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                  </select>
                  <input
                    type="text"
                    value={(tl.teachingLevel || []).join(", ")}
                    onChange={(e) =>
                      updateTrainerLangLevels(idx, e.target.value)
                    }
                    className="input-field"
                    placeholder="Teaching Levels (comma-separated)"
                  />
                  <button
                    type="button"
                    onClick={() => removeFromArray("trainerLanguages", idx)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  addComplexToArray("trainerLanguages", {
                    language: "",
                    proficiency: "Fluent",
                    teachingLevel: [],
                  })
                }
                className="btn-primary"
              >
                Add Trainer Language
              </button>
            </div>

            {/* Certifications */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Certifications
              </label>
              {(formData.profile.certifications || []).map(
                (cert: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-100 p-4 rounded mb-4 space-y-2"
                  >
                    {certFields.map((f) => (
                      <input
                        key={f.key}
                        type={f.type}
                        value={cert[f.key] ?? ""}
                        placeholder={f.placeholder}
                        min={f.min}
                        max={f.max}
                        onChange={(e) => {
                          const val =
                            f.type === "number"
                              ? parseInt(e.target.value, 10) || null
                              : e.target.value;
                          updateObjectInArray(
                            "certifications",
                            idx,
                            f.key,
                            val,
                          );
                        }}
                        className="input-field"
                      />
                    ))}

                    {/* Certificate Image */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Certificate Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          updateObjectInArray(
                            "certifications",
                            idx,
                            "certificateImage",
                            file
                          );
                        }}
                        className="input-field"
                      />
                      {cert.certificateImage && (
                        <img
                          src={
                            cert.certificateImage instanceof File
                              ? URL.createObjectURL(cert.certificateImage)
                              : certPreviews[idx]
                          }
                          alt="Cert"
                          className="w-32 h-32 mt-2 object-cover rounded border"
                        />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromArray("certifications", idx)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ),
              )}

              <button
                type="button"
                onClick={() =>
                  addComplexToArray("certifications", {
                    name: "",
                    issuer: "",
                    year: null,
                    certificateImage: "",
                    certificateLink: "",
                  })
                }
                className="btn-primary"
              >
                Add Certification
              </button>
            </div>

            {/* Availability */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Availability
              </label>
              {(formData.profile.availability || []).map((av, idx) => (
                <div
                  key={String(av.day || idx)}
                  className="bg-gray-100 p-4 rounded mb-4 space-y-2"
                >
                  <div className="font-medium capitalize">{av.day}</div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!!av.available}
                      onChange={(e) =>
                        updateAvailability(idx, "available", e.target.checked)
                      }
                      className="mr-2"
                    />{" "}
                    Available
                  </label>
                  {av.available && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={av.startTime || ""}
                        onChange={(e) =>
                          updateAvailability(idx, "startTime", e.target.value)
                        }
                        className="input-field"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={av.endTime || ""}
                        onChange={(e) =>
                          updateAvailability(idx, "endTime", e.target.value)
                        }
                        className="input-field"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Media & Social */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Media & Social Links
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Demo Video URL (YouTube)
                </label>
                <input
                  type="url"
                  name="profile.demoVideo"
                  value={formData.profile.demoVideo}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="profile.socialMedia.instagram"
                  value={formData.profile.socialMedia.instagram}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  name="profile.socialMedia.youtube"
                  value={formData.profile.socialMedia.youtube}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://youtube.com/channel/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="profile.socialMedia.linkedin"
                  value={formData.profile.socialMedia.linkedin}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
          {/*Submit/ Update Profile & Loading  */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: user?.name || "",
                  email: user?.email || "",
                  profile: defaultProfile,
                });
                setSuccess("");
                setError("");
              }}
              className="btn-ghost"
            >
              Reset
            </button>
          </div>
        </form>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <ManageClasses />
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
