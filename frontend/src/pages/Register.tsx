// File: src/pages/Register.tsx
import React, { useEffect, useState } from 'react'
//  useMemo,removd from above
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import StepRole from './register/Steps/StepRole'
import StepBasicInfo from './register/Steps/StepBasicInfo'
import StepChooseLearningType from './register/Steps/StepChooseLearningType'
import StepStudentSubjects from './register/Steps/StepStudentSubjects'
import StepTrainerDetails from './register/Steps/StepTrainerDetails'
import StepFinal from './register/Steps/StepFinal'
import { motion, AnimatePresence } from 'framer-motion'
import type { RegisterFormData } from './register/types'
import StepTrainerTeach from './register/Steps/StepTrainerTeach'
import StepTrainerDocuments from './register/Steps/StepTrainerDocuments'
import { Home } from 'lucide-react'
import axios from 'axios'
import registerBg from "../assets/register_bg.png";
import studentRegBg from "../assets/Student_reg_bg.jpeg";

const initialData: RegisterFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'student',
  education: '',
  experience: '',
  certificates: [],
  dob: '',
  bio: '',
  resume: null,
  phone: '',
  nationalityCode: '',
  continent: '',
  location: '',
  learningType: '',
  learningValues: [],
  subjects: [],
  languages: [],
  hobbies: [],
  standards: [],
  customStandardRange: '',
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [searchParams] = useSearchParams()
  const preRole = (searchParams.get('role') || undefined) as 'student' | 'trainer' | undefined
  const preselect = searchParams.get('preselect') || '' // e.g. subject or language id

  const [formData, setFormData] = useState<RegisterFormData>({ ...initialData, role: preRole })
  const rolePreselected = preRole === 'trainer' || preRole === 'student'

  const [stepIndex, setStepIndex] = useState<number>(
    rolePreselected ? 1 : 0
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Tracks if user came by pressing BACK
  const [comingFromBack, setComingFromBack] = useState(false);

  const steps = formData.role === "trainer"
    ? ['role', 'basic', 'trainerTeach', 'trainerDocs', 'trainerDetails', 'final'] as const
    : ['role', 'basic', 'learningType', 'details', 'final'] as const;

  type StepKey = typeof steps[number]


  useEffect(() => {
    if (!preselect) return;

    // Add preselect to correct array
    setFormData(prev => {
      const isLang = preselect.startsWith("lang_");
      const cleaned = isLang ? preselect.replace("lang_", "") : preselect;

      return {
        ...prev,
        subjects: isLang ? prev.subjects : Array.from(new Set([...prev.subjects, cleaned])),
        languages: isLang ? Array.from(new Set([...prev.languages, cleaned])) : prev.languages,
      };
    });

  }, [preselect]);

  const currentStep = steps[stepIndex] as StepKey

  const goNext = () => {
    setComingFromBack(false);
    setStepIndex(i => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => {
    setComingFromBack(true);
    setStepIndex(i => Math.max(i - 1, 0));
  };

  // Resume
  async function uploadResumeToR2(file: File): Promise<string> {
    // 1) get signed url
    const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-upload-url`, {
      fileName: file.name,
      fileType: file.type,
    });

    // 2) upload file to R2
    await axios.put(data.uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });

    // 3) return key to store in DB
    return data.key;
  }
  // certificates
  async function uploadCertificateToR2(file: File): Promise<string> {
    const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-upload-url`, {
      fileName: file.name,
      fileType: file.type,
      folderMain: "trainers",
      folderSub: "certificates"
    });

    await axios.put(data.uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });

    return data.key;
  }

  const onSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // phone validation
      const phoneDigits = (formData.phone || '').replace(/\D/g, '')
      if (phoneDigits.length < 10) {
        setError('Please supply a valid phone number')
        setLoading(false)
        return
      }

      const profilePayload: any = {
        phone: formData.phone || '',
        location: formData.location || '',
        continent: formData.continent || '',
        nationalityCode: formData.nationalityCode || '',
        bio: formData.bio || '',
        hobbies: formData.hobbies || [],
      }

      //  Date or null
      if (formData.dob) {
        // keeping ISO string (backend will accept Date-ish string)
        profilePayload.dob = new Date(formData.dob)
      }

      // Upload resume BEFORE register API call

      if (formData.resume instanceof File) {
        try {
          const key = await uploadResumeToR2(formData.resume);
          profilePayload.resume = key;
        } catch (err) {
          setError("Resume upload failed. Please try again.");
          setLoading(false);
          return;
        }
      } else if (typeof formData.resume === "string") {
        profilePayload.resume = formData.resume;
      }

      // Trainer-specific mapping
      if (formData.role === 'trainer') {
        // experience: convert to number (0 fallback)
        const expNumber = parseFloat(String(formData.experience || '0')) || 0
        profilePayload.experience = expNumber

        // teachingExperienceDetails keep as text if present
        profilePayload.teachingExperienceDetails = String(formData.experience || '')

        // specializations (map UI subjects -> specializations)
        // if UI stores subjects for trainer in formData.subjects, map to specializations.
        if (Array.isArray(formData.subjects) && formData.subjects.length > 0) {
          profilePayload.specializations = formData.subjects
        }
        // Trainer Hobbies → profile.hobbies
        if (Array.isArray(formData.hobbies) && formData.hobbies.length > 0) {
          profilePayload.hobbies = formData.hobbies;
        }

        // standards (array) — backend field is standards
        if (Array.isArray(formData.standards)) profilePayload.standards = formData.standards

        // certifications: ensure objects that match schema
        // UI should supply formData.certificates as array of Certificate objects (name, issuer, year, certificateLink, issuedDate, certificateImage)
        if (Array.isArray(formData.certificates) && formData.certificates.length > 0) {
          // For R2 uploads
          profilePayload.certifications = [];

          for (const c of formData.certificates) {
            let imageKey = "";

            if (c.certificateImage instanceof File) {
              imageKey = await uploadCertificateToR2(c.certificateImage);
            } else if (typeof c.certificateImage === "string") {
              imageKey = c.certificateImage;
            }

            profilePayload.certifications.push({
              name: String(c.name || ''),
              issuer: String(c.issuer || ''),
              year: c.issueYear ? Number(c.issueYear) : null,
              certificateLink: c.certificateLink || '',
              issuedDate: c.issuedDate ? new Date(c.issuedDate) : null,
              certificateImage: imageKey,
            });
          }

        } else {
          profilePayload.certifications = []
        }

        // nationalityCode already added above
        // other trainer-only fields
        profilePayload.education = formData.education || ''
        profilePayload.verificationStatus = 'pending'
      }

      // Student-specific mapping
      if (formData.role === 'student') {
        // ensure learningType -> learningValues
        const lt = formData.learningType || ''
        let lv: string[] = []

        if (lt === 'subjects') lv = Array.isArray(formData.subjects) ? formData.subjects : []
        else if (lt === 'languages') lv = Array.isArray(formData.languages) ? formData.languages : []
        else if (lt === 'hobbies') lv = Array.isArray(formData.hobbies) ? formData.hobbies : []
        else lv = formData.learningValues || []

        profilePayload.learningType = lt
        profilePayload.learningValues = lv

        // standards for students
        if (Array.isArray(formData.standards) && formData.standards.length > 0) {
          profilePayload.standards = formData.standards
        } else {
          profilePayload.standards = []
        }
      }

      // Always include shared fields that schema expects
      // languages (basic array) — keep as a simple array for UI convenience; trainers/students both can have it
      if (Array.isArray(formData.languages) && formData.languages.length > 0) {
        profilePayload.languages = formData.languages
      }

      // final payload to register
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile: profilePayload,
      }

      const result = await register(payload)
      console.log("FINAL PAYLOAD BEING SENT →", payload);


      if (result?.success) {

        // STUDENT → must verify email
        if (formData.role === "student") {
          navigate("/verify-email", {
            state: {
              email: result.email || formData.email,
              fromRegister: true
            },
            replace: true
          });
        }

        // TRAINER → wait for approval, go to login
        else if (formData.role === "trainer") {
          navigate("/login", {
            state: {
              trainerPending: true
            },
            replace: true
          });
        }
      }
      else {
        setError(result?.error || 'Registration failed')
      }
    } catch (e: any) {
      setError(e?.message || 'Registration error')
    }
    setLoading(false)
  }

  const containerVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  }

  return (

    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${formData.role === "student" ? studentRegBg : registerBg
          })`,
      }}
    >
      {/* Home Icon Button */}
      <Link
        to="/"
        className="absolute top-6 right-6 p-2 rounded-lg bg-[#fef5e4] text-[#5186cd] backdrop-blur-md hover:bg-[#5892de] hover:text-[#fef5e4]  transition flex items-center justify-center"
        aria-label="Go to Home"
      >
        <Home className="h-6 w-6  transition-colors duration-300" />
      </Link>

      {/* ---------------- Main Container ---------------- */}
      <div className="w-full max-w-xl mx-auto relative z-10">
        {/* Heading */}

        <div
          className={`text-center mb-6 sm:mb-8 px-2 ${formData.role === "student" ? "text-white" : "text-gray-900"
            }`}
        >

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-lg tracking-wide flex flex-wrap justify-center items-center gap-1 sm:gap-2 font-[Good Vibes]">

            {/* Join */}
            <span>Join</span>

            {/* LearnILM World */}
            <Link
              to="/"
              className={`flex items-center gap-1 sm:gap-2 ${formData.role === "student"
                ? "hover:text-blue-300"
                : "hover:text-[#5186cd]"
                } transition`}
            >
              <span>LearniLM</span>

              {/* Globe */}
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="inline-block text-2xl sm:text-3xl md:text-4xl"
              >
                🌎
              </motion.span>

              <span>World</span>
            </Link>
          </h1>

          {/* Sign in text */}
          <p className="mt-3 text-sm sm:text-base md:text-lg font-bold">
            Already have an account?{" "}
            <Link
              to="/login"
              className={`underline transition ${formData.role === "student"
                ? "hover:text-blue-300"
                : "hover:text-[#5186cd]"
                }`}
            >
              Sign in
            </Link>
          </p>

        </div>

        {/* Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl shadow-xl rounded-[28px] p-10 border border-blue-200 max-w-xl mx-auto">

          {/* Error Box */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          {/* ------------ Multi-step Animated Container ------------ */}
          <div className="relative  min-h-[520px] overflow-hidden">
            <AnimatePresence initial={false} custom={stepIndex} mode="wait">
              <motion.div key={currentStep} custom={stepIndex} variants={containerVariants} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 230, damping: 24 }} className="absolute inset-0 overflow-y-auto no-scrollbar">

                {/* ['role', 'basic', 'trainerTeach', 'trainerSelectValues', 'trainerDocs', 'trainerDetails', 'final'] */}
                {currentStep === 'role' && <StepRole formData={formData} setFormData={setFormData} onNext={() => goNext()} comingFromBack={comingFromBack} />}

                {currentStep === 'basic' && <StepBasicInfo formData={formData} setFormData={setFormData} onNext={() => goNext()} onBack={goBack} />}

                {currentStep === 'learningType' && <StepChooseLearningType formData={formData} setFormData={setFormData} onNext={() => goNext()} onBack={goBack} />}

                {currentStep === 'trainerTeach' && formData.role === 'trainer' && <StepTrainerTeach formData={formData} setFormData={setFormData} onNext={() => goNext()} onBack={goBack} comingFromBack={comingFromBack} />}

                {currentStep === 'trainerDocs' && formData.role === 'trainer' && <StepTrainerDocuments formData={formData} setFormData={setFormData} onNext={() => goNext()} onBack={goBack} />}

                {currentStep === 'details' && (formData.role === 'student' ? (
                  formData.learningType ? <StepStudentSubjects formData={formData} setFormData={setFormData} onNext={() => goNext()} onBack={goBack} /> : <StepChooseLearningType formData={formData} setFormData={setFormData} onNext={() => goNext()} onBack={goBack} />
                ) : null)}

                {currentStep === 'trainerDetails' &&
                  formData.role === 'trainer' && (
                    <StepTrainerDetails
                      formData={formData}
                      setFormData={setFormData}
                      onNext={() => goNext()}
                      onBack={goBack}
                    />
                  )}


                {currentStep === 'final' && <StepFinal formData={formData} setFormData={setFormData} onBack={goBack} onSubmit={onSubmit} loading={loading} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register