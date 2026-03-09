import React from "react";
import type { RegisterFormData } from "../types";

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  onBack: () => void;
};

export default function StepChooseLearningType({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {
  const options = [
    { key: "subjects", label: "Academic Subjects" },
    { key: "languages", label: "Foreign Languages" },
    { key: "hobbies", label: "Hobbies / Interests" },
  ] as const;

  const handleSelect = (key: typeof options[number]["key"]) => {
    setFormData(prev => ({
      ...prev,
      learningType: key,
      subjects: [],
      languages: [],
      hobbies: [],
      standards: [],
    }));
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold mb-2">What do you want to learn?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Choose one category so we can tailor your learning experience.
        </p>

        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              className={`w-full p-4 border rounded-xl text-left transition 
                ${formData.learningType === opt.key
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white hover:bg-gray-50"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-100">

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-gray-500 hover:text-black hover:scale-105 transition"
        >
          Back
        </button>

        <button
          onClick={() => {
            if (!formData.learningType) return alert("Please select one option.");
            onNext();
          }}
          className="w-48 sm:w-64 py-2 rounded-lg bg-[#5186cd] text-white hover:scale-105 transition font-medium"
        >
          Continue
        </button>

      </div>
    </div>
  );
}
