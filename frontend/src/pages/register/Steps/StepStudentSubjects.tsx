// File: StepStudentSubjects.tsx
import React, { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown, X } from "lucide-react";
import type { RegisterFormData } from "../types";
import { motion, AnimatePresence } from "framer-motion";

// ⭐ Updated Subjects (full clean merged list)
const SUBJECTS = [
  "English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "Hindi",
  "French",
  "German",
  "Spanish",
  "Chinese",
  "Japanese",
  "English Literature",
  "History and Civics",
  "EVS (Environmental Studies)",
  "Geography",
  "Computer Application",
  "Economic Application",
  "Economics",
  "History",
  "Physical Education",
  "Business Studies",
  "Information Technology",
  "Science",
  "Sanskrit",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Oriya",
  "Punjabi",
  "Urdu",
  "Marathi",
  "Bengali",
  "Manipuri",
  "Elements of business",
  "Accountancy",
  "Information and Communication Technology",
  "Computer Practices",
  "Computers",
  "Commercial Studies",
  "Commercial Applications",
  "Art",
  "Technical Drawing Applications",
  "Environmental Applications",
  "Performing Arts",
  "Home Science",
  "Global Perspectives",
  "Environmental Management",
  "Political Science",
  "Computer Science",
];

// ⭐ Updated Languages (your full list)
const LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Telugu",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Oriya",
  "Punjabi",
  "Urdu",
  "Marathi",
  "Manipuri",
];

// Student Hobbies
export const HOBBIES = [
  "Drawing",
  "Dancing",
  "Singing",
  "Guitar",
  "Cooking",
  "Yoga",
  "Workout Training"
];

// ⭐ Standards now ONLY Class 5 to 12
const STANDARDS = [
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

type Props = {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegisterFormData>>;
  onNext: () => void;
  onBack: () => void;
};

// ---------------- Reusable Chips Component ----------------
function SelectedChips({
  values,
  onRemove,
}: {
  values: string[];
  onRemove: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <AnimatePresence>
        {values.map((v) => (
          <motion.div
            key={v}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full flex items-center gap-2 shadow-sm"
          >
            {v}
            <button
              onClick={() => onRemove(v)}
              className="text-indigo-700 hover:text-red-600 p-0.5 rounded-full"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ---------------- Multi Select Component ----------------
function MultiSelect({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? options
      : options.filter((opt) =>
        opt.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="mb-5">
      <label className="font-medium text-gray-700 mb-1 block">{label}</label>

      <Listbox value={values} onChange={onChange} multiple>
        <div className="relative">
          <Listbox.Button className="w-full bg-white border rounded-lg p-3 flex justify-between items-center">
            <span className="text-gray-700">
              {values.length > 0 ? `${values.length} selected` : "Select options"}
            </span>
            <ChevronDown className="w-4" />
          </Listbox.Button>

          <Transition
            enter="transition duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
          >
            <Listbox.Options className="absolute mt-2 w-full max-h-60 overflow-auto bg-white border rounded-lg z-10 shadow-lg p-1">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border p-2 text-sm rounded-md mb-2"
              />

              {filtered.map((opt) => (
                <Listbox.Option
                  key={opt}
                  value={opt}
                  className={({ active }) =>
                    `cursor-pointer p-2 rounded-md flex items-center justify-between ${active ? "bg-indigo-100" : ""
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span>{opt}</span>
                      {selected && <Check className="w-4 text-indigo-600" />}
                    </>
                  )}
                </Listbox.Option>
              ))}

              {filtered.length === 0 && (
                <div className="text-center p-2 text-gray-500 text-sm">
                  No results
                </div>
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

// ---------------- MAIN COMPONENT ----------------
export default function StepStudentSubjects({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {
  // Map selections → learningValues automatically
  const updateLearningValues = (key: "subjects" | "languages" | "hobbies", arr: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [key]: arr,
      learningValues: arr,
      ...(key === "subjects" && arr.length === 0 ? { standards: [] } : {}),
    }));
  };

  const validateNext = () => {
    const type = formData.learningType;


    if (type === "subjects") {
      if (formData.subjects.length === 0)
        return alert("Select at least one subject.");

      if (!formData.standards || formData.standards.length === 0)
        return alert("Please select your class / grade.");
    }

    if (type === "languages" && formData.languages.length === 0)
      return alert("Select at least one language.");

    if (type === "hobbies" && formData.hobbies.length === 0)
      return alert("Select at least one hobby.");

    onNext();
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex-1 overflow-y-auto pr-1">
        <h3 className="text-lg font-bold mb-4">Tell us more</h3>

        {/* SUBJECTS */}
        {formData.learningType === "subjects" && (
          <>
            <MultiSelect
              label="Academic Subjects"
              options={SUBJECTS}
              values={formData.subjects}
              onChange={(arr) => updateLearningValues("subjects", arr)}
            />

            <SelectedChips
              values={formData.subjects}
              onRemove={(val) =>
                updateLearningValues(
                  "subjects",
                  formData.subjects.filter((s) => s !== val)
                )
              }
            />

            {(formData.subjects ?? []).length > 0 && (
              <>
                <MultiSelect
                  label="Your Standard / Class"
                  options={STANDARDS}
                  values={formData.standards ?? []}
                  onChange={(vals) =>
                    setFormData((prev) => ({ ...prev, standards: vals }))
                  }
                />

                <SelectedChips
                  values={formData.standards ?? []}
                  onRemove={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      standards: prev.standards?.filter((s) => s !== val),
                    }))
                  }
                />
              </>
            )}
          </>
        )}

        {/* LANGUAGES */}
        {formData.learningType === "languages" && (
          <>
            <MultiSelect
              label="Languages"
              options={LANGUAGES}
              values={formData.languages}
              onChange={(arr) => updateLearningValues("languages", arr)}
            />

            <SelectedChips
              values={formData.languages}
              onRemove={(val) =>
                updateLearningValues(
                  "languages",
                  formData.languages.filter((l) => l !== val)
                )
              }
            />
          </>
        )}

        {/* HOBBIES */}
        {formData.learningType === "hobbies" && (
          <>
            <MultiSelect
              label="Hobbies & Interests"
              options={HOBBIES}
              values={formData.hobbies}
              onChange={(arr) => updateLearningValues("hobbies", arr)}
            />

            <SelectedChips
              values={formData.hobbies}
              onRemove={(val) =>
                updateLearningValues(
                  "hobbies",
                  formData.hobbies.filter((h) => h !== val)
                )
              }
            />
          </>
        )}
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
          onClick={validateNext}
          className="w-48 sm:w-64 py-2 rounded-lg bg-[#5186cd] text-white hover:scale-105 transition font-medium"
        >
          Continue
        </button>

      </div>
    </div>
  );
}
