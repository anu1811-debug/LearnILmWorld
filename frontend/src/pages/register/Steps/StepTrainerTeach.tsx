import { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import FormLabel from "../../../components/FormLabel";

/* ---------------------------------------
   OPTION CONSTANTS DEFINED HERE
---------------------------------------- */

const SUBJECT_OPTIONS = [
  { value: "Maths", label: "Maths" },

  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
  { value: "Environmental Science", label: "Environmental Science" },

  { value: "Computer Science", label: "Computer Science" },

  { value: "History", label: "History" },
  { value: "Geography", label: "Geography" },
  { value: "Economics", label: "Economics" },
  { value: "Accounts & Finance", label: "Accounts & Finance" },

  { value: "Psychology", label: "Psychology" },
  { value: "Philosophy", label: "Philosophy" },

  { value: "Hindi", label: "Hindi" },
  { value: "Bengali", label: "Bengali" },
];


const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Urdu", label: "Urdu" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
];

// Trainer Hobbies (Professional Expertise Labels)
const HOBBY_OPTIONS = [
  { value: "Drawing", label: "Visual Arts / Drawing Instruction" },
  { value: "Dancing", label: "Dance Instruction" },
  { value: "Singing", label: "Vocal Coaching / Singing Lessons" },
  { value: "Guitar", label: "Guitar Instruction" },
  { value: "Cooking", label: "Culinary Arts / Cooking Classes" },
  { value: "Yoga", label: "Yoga Instruction" },
  { value: "Workout Training", label: "Personal Fitness Training" }
];

const STANDARD_OPTIONS = [
  // { value: "Class 1", label: "Class 1" },
  // { value: "Class 2", label: "Class 2" },
  // { value: "Class 3", label: "Class 3" },
  // { value: "Class 4", label: "Class 4" },
  { value: "Class 5", label: "Class 5" },
  { value: "Class 6", label: "Class 6" },
  { value: "Class 7", label: "Class 7" },
  { value: "Class 8", label: "Class 8" },
  { value: "Class 9", label: "Class 9" },
  { value: "Class 10", label: "Class 10" },
  { value: "Class 11", label: "Class 11" },
  { value: "Class 12", label: "Class 12" },
];

/* ---------------------------------------
   MULTISELECT COMPONENT (SELF CONTAINED)
---------------------------------------- */

function MultiSelect({
  options,
  selected,
  setSelected,
  placeholder,
  single = false,
}: any) {
  // When single === true:
  // - Listbox expects value to be a single value (not an array)
  // - onChange will be called with a single value
  //
  // When single === false:
  // - Listbox expects value to be an array
  // - onChange will be called with an array

  const handleSelection = (val: any) => {
    if (single) {
      // val is a single value (or undefined/null)
      setSelected(val ? [val] : []);
    } else {
      // val is already an array
      setSelected(Array.isArray(val) ? val : []);
    }
  };

  // Provide the correct "value" shape to Listbox
  const listboxValue = single ? (selected && selected.length ? selected[0] : null) : (selected || []);

  return (
    <Listbox value={listboxValue} onChange={handleSelection} multiple={!single}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-full border bg-white py-2 pl-3 pr-10 text-left shadow-sm">
          <span className="block truncate">
            {(!selected || selected.length === 0)
              ? placeholder
              : single
                ? options.find((o: any) => o.value === selected[0])?.label
                : `${selected.length} selected`}
          </span>

          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronsUpDown size={18} className="opacity-60" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg border">
            {options.map((option: any, idx: number) => (
              <Listbox.Option
                key={idx}
                value={option.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span
                      className={`block truncate ${isSelected ? "font-medium" : "font-normal"
                        }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <Check size={18} />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

/* ---------------------------------------
   SELECTED CHIPS COMPONENT
---------------------------------------- */

function SelectedChips({ items, setItems, options }: any) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((value: string, idx: number) => {
        const label = options.find((opt: any) => opt.value === value)?.label || value;

        return (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
          >
            {label}
            <button
              onClick={() => setItems(items.filter((x: string) => x !== value))}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </span>
        );
      })}
    </div>
  );
}

/* ---------------------------------------
        MAIN TRAINER TEACH STEP
---------------------------------------- */

type Props = {
  formData: any;
  setFormData: any;
  onNext: () => void;
  onBack: () => void;
  comingFromBack: boolean;
};

export default function StepTrainerTeach({
  formData,
  setFormData,
  onNext,
  onBack,
  comingFromBack,
}: Props) {
  const [teachingType, setTeachingType] = useState(formData.teachingType || "");

  const [subjects, setSubjects] = useState<string[]>(formData.teachingSubjects || []);
  const [languages, setLanguages] = useState<string[]>(formData.teachingLanguages || []);
  const [hobbies, setHobbies] = useState<string[]>(formData.teachingHobbies || []);
  const [standards, setStandards] = useState<string[]>(formData.teachingStandards || []);

  const [showCustomStandard, setShowCustomStandard] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Control teachingType change only if fields are cleared
  const [pendingTeachingType, setPendingTeachingType] = useState(teachingType);

  const handleClear = () => {
    setSubjects([]);
    setLanguages([]);
    setHobbies([]);
    setStandards([]);
    setShowCustomStandard(false);
    setCustomFrom("");
    setCustomTo("");

    setFormData((prev: any) => ({
      ...prev,
      teachingSubjects: [],
      teachingLanguages: [],
      teachingHobbies: [],
      teachingStandards: [],
      subjects: [],
      languages: [],
      hobbies: [],
      standards: [],
    }));

    // Allow switching teaching type
    setTeachingType("");
    setPendingTeachingType("");
  };

  const handleTeachingTypeChange = (val: string) => {
    // If any selection exists, prevent changing
    const hasSelection =
      subjects.length > 0 || languages.length > 0 || hobbies.length > 0;

    if (hasSelection) {
      alert("Please clear existing selections before changing teaching type.");
      return;
    }

    setTeachingType(val);
  };

  // Sync formData whenever selections change
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      teachingType,
      // always update the keys that onSubmit expects
      subjects: subjects,
      languages: languages,
      hobbies: hobbies,
      standards: standards,
      // optionally keep the internal teachingX keys for UI
      teachingSubjects: subjects,
      teachingLanguages: languages,
      teachingHobbies: hobbies,
      teachingStandards: standards,
    }));
  }, [teachingType, subjects, languages, hobbies, standards]);

  const canProceed = () => {
    if (!teachingType) return false;

    const selectedSomething =
      subjects.length > 0 || languages.length > 0 || hobbies.length > 0;

    if (!selectedSomething) return false;

    if (subjects.length > 0 && standards.length === 0) return false;

    return true;
  };

  return (
    <motion.div
      initial={{ x: comingFromBack ? -40 : 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: comingFromBack ? 40 : -40, opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Your Teaching Expertize</h2>

      {/* Teaching Type */}
      <div>
        <FormLabel required>Expertise</FormLabel>
        <MultiSelect
          single
          options={[
            { value: "subjects", label: "Subjects" },
            { value: "languages", label: "Languages" },
            { value: "hobbies", label: "Hobbies" },
          ]}
          selected={teachingType ? [teachingType] : []}
          setSelected={(val: any) => handleTeachingTypeChange(val[0] || "")}
          placeholder="Select your Expertise"
        />

        {/* Clear Button */}
        {(subjects.length > 0 || languages.length > 0 || hobbies.length > 0) && (
          <button
            onClick={handleClear}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-3xl hover:bg-red-600"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* SUBJECTS */}
      {teachingType === "subjects" && (
        <div>
          <FormLabel required>Subjects</FormLabel>
          <MultiSelect
            options={SUBJECT_OPTIONS}
            selected={subjects}
            setSelected={(vals: string[]) => {
              if (vals.length <= 1) {
                setSubjects(vals);
              }
            }}
            placeholder="Select subjects"
          />
          <SelectedChips
            items={subjects}
            setItems={(vals: any) => setSubjects(vals)}
            options={SUBJECT_OPTIONS}
          />
        </div>
      )}

      {/* LANGUAGES */}
      {teachingType === "languages" && (
        <div>
          <FormLabel required>Languages (Max 1)</FormLabel>
          <MultiSelect
            options={LANGUAGE_OPTIONS}
            selected={languages}
            setSelected={(vals: string[]) => {
              if (vals.length <= 1) setLanguages(vals);
            }}
            placeholder="Select languages"
          />
          <SelectedChips
            items={languages}
            setItems={(vals: any) => setLanguages(vals)}
            options={LANGUAGE_OPTIONS}
          />
        </div>
      )}

      {/* HOBBIES */}
      {teachingType === "hobbies" && (
        <div>
          <FormLabel required>Hobbies (Max 2)</FormLabel>
          <MultiSelect
            options={HOBBY_OPTIONS}
            selected={hobbies}
            setSelected={(vals: string[]) => {
              if (vals.length <= 2) setHobbies(vals);
            }}
            placeholder="Select hobbies"
          />
          <SelectedChips
            items={hobbies}
            setItems={(vals: any) => setHobbies(vals)}
            options={HOBBY_OPTIONS}
          />
        </div>
      )}

      {/* STANDARDS → visible only when subjects selected */}
      {subjects.length > 0 && (
        <div>
          <FormLabel required>Grades/Classes</FormLabel>
          <MultiSelect
            options={[...STANDARD_OPTIONS, { value: "custom", label: "Custom Range" }]}
            selected={standards}
            setSelected={(vals: any) => {
              if (vals.includes("custom")) {
                setShowCustomStandard(true);
                return;
              }
              setStandards(vals);
            }}
            placeholder="Select standards"
          />
          <SelectedChips
            items={standards}
            setItems={(vals: any) => setStandards(vals)}
            options={STANDARD_OPTIONS}
          />

          {showCustomStandard && (
            <div className="mt-3 p-3 border rounded-lg bg-gray-50 space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="To"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <button
                onClick={() => {
                  if (!customFrom || !customTo) return;

                  const newRange = `Class ${customFrom}-${customTo}`;
                  const updated = [...standards, newRange];

                  setStandards(updated);

                  setShowCustomStandard(false);
                  setCustomFrom("");
                  setCustomTo("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Add Range
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center gap-3 mt-6 pt-4 border-t border-gray-100">

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-gray-500 hover:text-black hover:scale-105 transition"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed()}
          className={`w-48 sm:w-64 py-2 rounded-lg text-white transition font-medium
      ${canProceed()
              ? "bg-[#5186cd] hover:scale-105"
              : "bg-[#5186cd]/50 cursor-not-allowed"
            }`}
        >
          Continue
        </button>

      </div>
    </motion.div>
  );
}
