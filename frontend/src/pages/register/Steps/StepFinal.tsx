import React, { useState } from 'react'
import type { RegisterFormData } from '../types'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import FormLabel from "../../../components/FormLabel"

type Props = {
  formData: RegisterFormData
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>
  onBack: () => void
  onSubmit: () => void       // DO NOT TOUCH THIS
  loading: boolean
}

const StepFinal: React.FC<Props> = ({
  formData,
  setFormData,
  onBack,
  onSubmit,
  loading
}) => {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // LOCAL FIELD ERRORS
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  // LOCAL VALIDATION BEFORE CALLING onSubmit()
  const validateInputs = () => {
    const newErrors: any = {}

    // NAME VALIDATION
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain alphabets and spaces"
    }

    // PHONE VALIDATION
    const phoneDigits = (formData.phone || "").replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      newErrors.phone = "Please supply a valid phone number"
    }

    // PASSWORD VALIDATION
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long"
    }

    // CONFIRM PASSWORD VALIDATION
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  // WRAPPER for real onSubmit()
  const handleSubmitClick = () => {
    if (validateInputs()) {
      // No field errors → call original onSubmit()
      onSubmit()
    }
  }

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex-1 pb-8">
        <h3 className="text-xl font-bold mb-5">Almost done — Account Details</h3>

        <div className="space-y-5">

          {/* Full Name */}
          <div>
            <FormLabel required>Full Name</FormLabel>
            <input
              type="text"
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border-2 border-gray-300 rounded-full focus:border-[#5186cd] focus:outline-none transition"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <FormLabel required>Phone Number</FormLabel>
            <PhoneInput
              country={'in'}
              value={formData.phone}
              onChange={(phone) =>
                setFormData(prev => ({
                  ...prev,
                  phone,
                }))
              }
              inputStyle={{
                width: "100%",
                height: "48px",
                borderRadius: "9999px",
                border: "2px solid #d1d5db",
                paddingLeft: "58px",
              }}
              buttonStyle={{
                borderRadius: "9999px 0 0 9999px",
                border: "2px solid #d1d5db",
              }}
            />

            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <FormLabel required>Password</FormLabel>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e =>
                  setFormData(prev => ({ ...prev, password: e.target.value }))
                }
                className="w-full p-3 border-2 border-gray-300 rounded-full focus:border-[#5186cd] focus:outline-none transition"
                placeholder="Create a password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <FormLabel required>Confirm Password</FormLabel>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))
                }
                className="w-full p-3 border-2 border-gray-300 rounded-full focus:border-[#5186cd] focus:outline-none transition"
                placeholder="Re-enter your password"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-100">

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-gray-500 hover:text-black hover:scale-105 transition"
        >
          Back
        </button>

        <button
          onClick={handleSubmitClick}
          disabled={loading}
          className="w-48 sm:w-64 py-2 rounded-lg bg-[#5186cd] text-white hover:scale-105 transition font-medium disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Create Account"}
        </button>

      </div>
    </div>
  )
}

export default StepFinal
