import React, { useState, useEffect, KeyboardEvent } from 'react';

type PreferenceTabProps = {
  user: any;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
};

const PreferenceTab: React.FC<PreferenceTabProps> = ({ user, updateProfile }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [learningType, setLearningType] = useState('');

  // Editable values ke states
  const [languages, setLanguages] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]); 
  const [standards, setStandards] = useState<string[]>([]); 
  const [hobbies, setHobbies] = useState<string[]>([]);

  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Initialize data when user object loads
  useEffect(() => {
    if (!user) return;

    // Data user.profile ke andar ho sakta hai ya direct user object mein
    const profileData = user.profile || user;
    
    const type = profileData.learningType || '';
    setLearningType(type);

    // Safely extract learningValues
    const learningVals = Array.isArray(profileData.learningValues) ? profileData.learningValues : [];

    // Helper function taaki empty array ([]) ko ignore karke sahi values uthaye
    const getSafeArray = (primaryArr: any) => {
      if (Array.isArray(primaryArr) && primaryArr.length > 0) return primaryArr;
      if (learningVals.length > 0) return learningVals;
      return [];
    };

    if (type === 'languages') {
      setLanguages(getSafeArray(profileData.languages));
    } else if (type === 'subjects') {
      // Backend may save it as 'subjects' or 'specializations'
      setSpecializations(getSafeArray(profileData.specializations || profileData.subjects));
      setStandards(Array.isArray(profileData.standards) ? profileData.standards : []);
    } else if (type === 'hobbies') {
      setHobbies(getSafeArray(profileData.hobbies));
    }
  }, [user]);

  // UI labels for the read-only input
  const learningTypeLabels: Record<string, string> = {
    subjects: 'Academic Subjects',
    languages: 'Foreign Languages',
    hobbies: 'Hobbies / Interests',
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, type: string) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const val = inputValue.trim();

      if (type === 'language' && !languages.includes(val)) setLanguages([...languages, val]);
      if (type === 'subject' && !specializations.includes(val)) setSpecializations([...specializations, val]);
      if (type === 'standard' && !standards.includes(val)) setStandards([...standards, val]);
      if (type === 'hobby' && !hobbies.includes(val)) setHobbies([...hobbies, val]);

      setInputValue('');
      setActiveInput(null);
    }
  };

  const removeTag = (type: string, indexToRemove: number) => {
    if (type === 'language') setLanguages(languages.filter((_, i) => i !== indexToRemove));
    if (type === 'subject') setSpecializations(specializations.filter((_, i) => i !== indexToRemove));
    if (type === 'standard') setStandards(standards.filter((_, i) => i !== indexToRemove));
    if (type === 'hobby') setHobbies(hobbies.filter((_, i) => i !== indexToRemove));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const profilePayload: any = { learningType };

      // Hum backend ke registration logic (StepChooseLearningType) se match karne ke liye
      // specific array ke sath-sath learningValues mein bhi same data bhejenge.
      if (learningType === 'languages') {
        profilePayload.languages = languages;
        profilePayload.learningValues = languages; 
      } else if (learningType === 'subjects') {
        profilePayload.specializations = specializations;
        profilePayload.subjects = specializations; // Sending both keys just to be safe
        profilePayload.standards = standards;
        profilePayload.learningValues = specializations;
      } else if (learningType === 'hobbies') {
        profilePayload.hobbies = hobbies;
        profilePayload.learningValues = hobbies;
      }

      const result = await updateProfile({ profile: profilePayload });
      
      if (result?.success) {
        setSuccess('Preferences updated successfully!');
      } else {
        setError(result?.error || 'Failed to update preferences.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  // Tag Input Component
  const TagInputBox = ({ title, type, items, placeholder }: { title: string, type: string, items: string[], placeholder: string }) => (
    <div className="mb-6">
      <label className="block text-sm text-gray-700 mb-2">{title}</label>
      <div className="w-full min-h-[52px] p-2 border border-gray-100 rounded-lg bg-gray-50 flex flex-wrap gap-2 items-center">
        {items.map((item, idx) => (
          <span key={idx} className="bg-[#3b82f6] text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-sm">
            {item}
            <button 
              type="button"
              onClick={() => removeTag(type, idx)}
              className="hover:text-gray-200 focus:outline-none ml-1 text-xs"
            >
              ✕
            </button>
          </span>
        ))}
        
        {activeInput === type ? (
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, type)}
            onBlur={() => { setActiveInput(null); setInputValue(''); }}
            placeholder="Type & press Enter"
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-[#3b82f6] px-2 placeholder-[#93c5fd]"
          />
        ) : (
          <button 
            type="button"
            onClick={() => { setActiveInput(type); setInputValue(''); }}
            className="text-[#3b82f6] text-sm px-2 hover:opacity-80"
          >
            + {placeholder}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Preference</h3>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm">{success}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

      <div className="mb-8">
        <label className="block text-sm text-gray-700 mb-2">Interests</label>
        <div className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 text-sm">
          {learningTypeLabels[learningType] || 'Not Selected'}
        </div>
      </div>

      {learningType === 'subjects' && (
        <>
          <TagInputBox title="Subjects" type="subject" items={specializations} placeholder="Add Subject" />
          <TagInputBox title="Standards / Grades" type="standard" items={standards} placeholder="Add Grade Level" />
        </>
      )}

      {learningType === 'languages' && (
        <TagInputBox title="Languages" type="language" items={languages} placeholder="Add Language" />
      )}

      {learningType === 'hobbies' && (
        <TagInputBox title="Hobbies / Interests" type="hobby" items={hobbies} placeholder="Add Hobby" />
      )}

      <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
        <button
          type="button"
          className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading || !learningType}
          className="px-6 py-2.5 bg-[#3b82f6] text-white rounded-lg hover:bg-blue-600 font-medium text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[130px]"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default PreferenceTab;