// File: src/pages/register/Steps/StepBasicInfo.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactFlagsSelect from "react-flags-select";
import type { RegisterFormData } from "../types";
import FormLabel from "../../../components/FormLabel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CONTINENTS = ["Africa", "Asia", "Europe", "North America", "South America", "Australia / Oceania", "Antarctica"];

// ISO country codes grouped by continent
const CONTINENT_COUNTRIES: Record<string, string[]> = {
  Africa: [
    "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CG", "CD", "DJ", "EG",
    "GQ", "ER", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE", "LS", "LR", "LY", "MG", "MW",
    "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA",
    "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW"
  ],

  Asia: [
    "AF", "AM", "AZ", "BH", "BD", "BT", "BN", "KH", "CN", "CY", "GE", "IN", "ID", "IR", "IQ",
    "IL", "JP", "JO", "KZ", "KW", "KG", "LA", "LB", "MY", "MV", "MN", "MM", "NP", "KP", "KR",
    "OM", "PK", "PH", "QA", "SA", "SG", "LK", "SY", "TW", "TJ", "TH", "TL", "TR", "TM", "AE",
    "UZ", "VN", "YE"
  ],

  Europe: [
    "AL", "AD", "AT", "BY", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE",
    "GI", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "MD", "MC", "ME", "NL",
    "MK", "NO", "PL", "PT", "RO", "RU", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "UA", "GB", "VA"
  ],

  "North America": [
    "AG", "BS", "BB", "BZ", "CA", "CR", "CU", "DM", "DO", "SV", "GD", "GT", "HT", "HN", "JM",
    "MX", "NI", "PA", "KN", "LC", "VC", "TT", "US"
  ],

  "South America": [
    "AR", "BO", "BR", "CL", "CO", "EC", "GY", "PY", "PE", "SR", "UY", "VE"
  ],

  "Australia / Oceania": [
    "AU", "FJ", "KI", "MH", "FM", "NR", "NZ", "PW", "PG", "WS", "SB", "TO", "TV", "VU"
  ],

  Antarctica: []
};

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  onBack: () => void;
};

const StepBasicInfo: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<{ email?: string; country?: string; continent?: string }>(
    {},
  );

  const [emailStatus, setEmailStatus] = useState<{
    message?: string;
    blocked?: boolean;
  }>({});

  const city = formData.location || "";

  const checkEmail = async (email: string) => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: formData.role }),
      });

      const data = await res.json();
      setEmailStatus(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Validations
  const validate = () => {
    let temp: any = {};

    if (!formData.email.trim()) temp.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      temp.email = "Invalid email format";

    if (!formData.continent) temp.continent = "Please select your continent";

    if (!formData.nationalityCode) temp.country = "Please select your country";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    if (emailStatus.blocked) return;

    onNext();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 pr-2">
        {/* Heading */}
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Tell us about yourself
        </motion.h3>

        <p className="text-sm text-gray-500 mb-3">
          This helps us personalize your experience.
        </p>
        {/* Tips */}
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-2 shadow-sm ring-1 ring-blue-200 animate-pulse-subtle">
          {/* Google Icon */}
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-blue-800">
            <span className="font-bold">Pro Tip:</span> Login with Google only
            works if you register with your Google account.
          </p>
        </div>
        {/* Inputs */}
        <div className="space-y-5">
          {/* Email */}
          <div>
            <FormLabel required>Email address</FormLabel>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              onBlur={() => checkEmail(formData.email)}
              className={`w-full p-3 border-2 rounded-full outline-none transition ${errors.email
                ? "border-red-500"
                : "focus:ring-2 focus:ring-[#5186cd]/60"
                }`}
              placeholder="you@example.com"
            />
            {/* existing email error */}
            {emailStatus.message && !errors.email && (
              <p className="text-xs text-red-500 mt-1">{emailStatus.message}</p>
            )}

            {/* email validation error */}
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Continent Select */}
          <div>
            <FormLabel required>Continent</FormLabel>

            <select
              value={formData.continent || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  continent: e.target.value,
                  nationalityCode: "" // reset country
                }))
              }
              className="w-full p-3 border rounded-full focus:ring-2 focus:ring-[#5186cd]/60 outline-none transition"
            >
              <option value="">Select continent</option>

              {CONTINENTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {errors.continent && (
              <p className="text-xs text-red-500 mt-1">{errors.continent}</p>
            )}
          </div>

          {/* Country Select with Flags */}
          <div>
            <FormLabel required>Country</FormLabel>

            <ReactFlagsSelect
              countries={
                formData.continent
                  ? CONTINENT_COUNTRIES[formData.continent] || []
                  : undefined
              }
              selected={formData.nationalityCode || ""}
              searchable={true}
              searchPlaceholder={
                formData.continent
                  ? "Search country..."
                  : "Select continent first"
              }
              onSelect={(code) => {
                const upper = code.toUpperCase();

                setFormData((prev) => ({
                  ...prev,
                  nationalityCode: upper,
                }));
              }}
              placeholder="Select country"
              className={`country-select ${errors.country ? "border-red-500" : ""}`}
            />

            {errors.country && (
              <p className="text-xs text-red-500 mt-1">{errors.country}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City / Area (optional)
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="City, area or pin code"
              className="w-full p-3 border rounded-full focus:ring-2 focus:ring-[#5186cd]/60 outline-none transition"
            />

            <p className="text-xs text-gray-400 mt-1">
              Tailor your experience! Knowing your city helps us filter for
              local accents and regional nuances.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-100">

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-gray-500 hover:text-black hover:scale-105 transition"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className="w-48 sm:w-64 py-2 rounded-lg bg-[#5186cd] text-white hover:scale-105 transition font-medium"
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default StepBasicInfo;
