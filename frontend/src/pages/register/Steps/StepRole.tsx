// File: src/pages/register/Steps/StepRole.tsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users } from "lucide-react";
import type { RegisterFormData } from "../types";
import logo from "../../../assets/logo.png";

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  comingFromBack: boolean;
};

const StepRole: React.FC<Props> = ({
  formData,
  setFormData,
  onNext,
  comingFromBack,
}) => {
  useEffect(() => {
    if (
      !comingFromBack &&
      (formData.role === "student" || formData.role === "trainer")
    ) {
      onNext();
    }
  }, [formData.role, comingFromBack]);

  const handleSelect = (role: "student" | "trainer") => {
    setFormData((prev) => ({ ...prev, role }));
    onNext();
  };

  return (
    <div className="h-full flex flex-col items-center px-2 sm:px-4">

      {/* Logo */}
      <img
        src={logo}
        alt="LearnILM World"
        className="h-14 sm:h-16 mb-4"
      />

      {/* Heading */}
      <motion.div
        className="text-center w-full max-w-xl"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-800 leading-snug">
          How do you want to begin your journey?
        </h3>

        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          Choose the role that represents you today. This helps us tailor the
          experience specifically for your goals.
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="mt-6 w-full grid grid-cols-2 gap-4">

        {/* Student */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect("student")}
          className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all p-4
          ${formData.role === "student"
              ? "border-[#5186cd] bg-[#5186cd]/15 shadow-md ring-2 ring-[#5186cd]/20"
              : "border-gray-200 bg-white hover:border-[#5186cd]/40 hover:shadow-sm"
            }`}
        >
          <GraduationCap
            size={40}
            className={`mb-2 ${formData.role === "student"
              ? "text-[#5186cd]"
              : "text-gray-500"
              }`}
          />

          <span
            className={`font-semibold text-sm sm:text-base ${formData.role === "student"
              ? "text-[#5186cd]"
              : "text-gray-800"
              }`}
          >
            Student
          </span>

          {/* Hidden on mobile */}
          <p className="hidden sm:block text-xs text-gray-500 mt-1 text-center px-2">
            Learn new skills, improve languages, and grow with global trainers.
          </p>
        </motion.button>

        {/* Trainer */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSelect("trainer")}
          className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all p-4
          ${formData.role === "trainer"
              ? "border-[#5186cd] bg-[#5186cd]/15 shadow-md ring-2 ring-[#5186cd]/20"
              : "border-gray-200 bg-white hover:border-[#5186cd]/40 hover:shadow-sm"
            }`}
        >
          <Users
            size={40}
            className={`mb-2 ${formData.role === "trainer"
              ? "text-[#5186cd]"
              : "text-gray-500"
              }`}
          />

          <span
            className={`font-semibold text-sm sm:text-base ${formData.role === "trainer"
              ? "text-[#5186cd]"
              : "text-gray-800"
              }`}
          >
            Trainer
          </span>

          {/* Hidden on mobile */}
          <p className="hidden sm:block text-xs text-gray-500 mt-1 text-center px-2">
            Teach learners worldwide and build your professional portfolio.
          </p>
        </motion.button>
      </div>

      {/* Mobile Combined Description */}
      <p className="sm:hidden text-xs text-gray-600 mt-4 text-center max-w-xs leading-relaxed">
        Learn from expert trainers or share your knowledge and teach students worldwide.
      </p>

      {/* Note */}
      <p className="text-xs text-gray-500 mt-3 text-center max-w-sm leading-relaxed">
        Once you create your account, your role cannot be changed.
        However, you can update your profile details anytime.
      </p>

    </div>
  );
};

export default StepRole;