// FILE: src/components/FiltersPanel.tsx
import React, { useMemo } from 'react'
import { ChevronDown, Dot, SlidersHorizontal } from 'lucide-react'
import * as Flags from 'country-flag-icons/react/3x2'


const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'jp', name: 'Japanese', flag: '🇯🇵' }
]

// const COUNTRIES = [
//     { code: 'US', name: 'United States' },
//     { code: 'GB', name: 'United Kingdom' },
//     { code: 'CA', name: 'Canada' },
//     { code: 'AU', name: 'Australia' },
//     { code: 'IN', name: 'India' },
//     { code: 'DE', name: 'Germany' },
//     { code: 'FR', name: 'France' },
//     { code: 'ES', name: 'Spain' },
//     { code: 'IT', name: 'Italy' },
//     { code: 'JP', name: 'Japan' },
//     { code: 'CN', name: 'China' },
//     { code: 'BR', name: 'Brazil' },
//     { code: 'MX', name: 'Mexico' },
//     { code: 'RU', name: 'Russia' },
//     { code: 'KR', name: 'South Korea' },
//     { code: 'NL', name: 'Netherlands' },
//     { code: 'SE', name: 'Sweden' },
//     { code: 'NO', name: 'Norway' },
//     { code: 'DK', name: 'Denmark' },
//     { code: 'FI', name: 'Finland' },
//     { code: 'PL', name: 'Poland' },
//     { code: 'PT', name: 'Portugal' },
//     { code: 'GR', name: 'Greece' },
//     { code: 'TR', name: 'Turkey' },
//     { code: 'EG', name: 'Egypt' },
//     { code: 'ZA', name: 'South Africa' },
//     { code: 'NG', name: 'Nigeria' },
//     { code: 'KE', name: 'Kenya' },
//     { code: 'AR', name: 'Argentina' },
//     { code: 'CL', name: 'Chile' },
//     { code: 'CO', name: 'Colombia' },
//     { code: 'PE', name: 'Peru' },
//     { code: 'TH', name: 'Thailand' },
//     { code: 'VN', name: 'Vietnam' },
//     { code: 'PH', name: 'Philippines' },
//     { code: 'ID', name: 'Indonesia' },
//     { code: 'MY', name: 'Malaysia' },
//     { code: 'SG', name: 'Singapore' },
//     { code: 'NZ', name: 'New Zealand' }
// ]


const SUBJECTS = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Science', 'Geography', 'History', 'Civics', 'Computer Science', 'Economics', 'Accountancy', 'Business Studies'
]


const HOBBIES = [
    'Dance', 'Singing', 'Guitar', 'Piano', 'Photography', 'Yoga', 'Fitness', 'Cooking', 'Drawing', 'Painting'
]


interface Props { learningType: string; filters: any; setFilters: (f: any) => void; nationalities: string[]; clearFilters: () => void }


const renderFlag = (code?: string) => {
    if (!code) return null;
    const upper = code.toUpperCase();
    const Flag = (Flags as any)[upper];
    if (!Flag) return null;
    return <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm"><Flag title={upper} className="w-full h-full object-cover" /></div>
}


const FiltersPanel: React.FC<Props> = ({ learningType, filters, setFilters, nationalities, clearFilters }) => {
    // const uniqueNationalities = nationalities;

    const closeAllDropdowns = () => {
        if (filters.openDropdown) {
            setFilters((p: any) => ({
                ...p,
                openDropdown: null
            }))
        }
    }

    return (
        <div className="bg-[#e9f1fb] rounded-[36px] p-6 border border-[#5186cd]/20 shadow-sm">

            {/* quick filter and clear button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center justify-between px-4 py-3 mb-4">

                {/* Quick Filters */}
                <div className="flex items-center gap-2">
                    <div className='p-2 bg-blue-300 rounded-full'>
                    <SlidersHorizontal size={18} className="text-white " />

                    </div>
                    <span className="font-bold text-[#5186cd] text-lg">Quick Filters ✨</span>
                </div>

                {/* Clear All */}
                <button
                    onClick={clearFilters}
                    className="px-5 py-2 bg-white rounded-full hover:bg-[#fef5e4] text-[#5186cd] text-sm font-bold transition border border-[#5186cd]/20 shadow-sm"
                >
                    Clear All
                </button>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {/*changed CBE56A */}
                {learningType === 'language' && (
                    <div className="relative p-4 rounded-2xl bg-white border border-[#5186cd]/20 shadow-sm">
                        <label className="text-sm font-bold text-[#5186cd] flex items-center"><Dot className='text-blue-600 w-7 h-7 -mt-1 '/>All Languages</label>
                        <button onClick={() =>
                            setFilters((p: any) => ({
                                ...p,
                                openDropdown: p.openDropdown === "language" ? null : "language"
                            }))
                        }
                            className="w-full mt-3 px-4 py-2 border-2 border-black rounded-full bg-white text-sm font-bold flex justify-between items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <span>{filters.language || 'Language'}</span>
                            <ChevronDown className={`h-4 w-4`} />
                        </button>


                        {/* Dropdown local UI (simple: toggling stored on filters._toggleLanguageDropdown) */}
                        {filters.openDropdown === "language" && (
                            <div className="absolute bg-white border border-[#5186cd]/20 shadow-xl rounded-2xl p-3 mt-3 w-44 z-30 max-h-52 overflow-y-auto">
                                <input type="text" placeholder="Search..." value={filters.language} onChange={(e) => setFilters((p: any) => ({ ...p, language: e.target.value }))} className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm" />
                                {LANGUAGES.filter(l => l.name.toLowerCase().includes((filters.language || '').toLowerCase())).map(lang => (
                                    <div key={lang.code} onClick={() => setFilters((p: any) => ({
                                        ...p, language: lang.name, openDropdown: null
                                    }))} className="cursor-pointer px-3 py-2 hover:bg-[#e9f1fb] rounded-lg text-sm font-medium"
                                    >{lang.flag}<span>{lang.name}</span></div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {learningType === 'subject' && (
                    <div className="relative p-4 rounded-2xl bg-white border border-[#5186cd]/20 shadow-sm">
                        <label className="text-sm font-bold text-[#5186cd] flex items-center"><Dot className='text-blue-600 w-7 h-7 -mt-1 '/>All Subjects</label>

                        <button
                            onClick={() =>
                                setFilters((p: any) => ({
                                    ...p,
                                    openDropdown: p.openDropdown === "subject" ? null : "subject"

                                }))
                            }
                            className="w-full mt-3 px-4 py-2 border-2 border-black rounded-full bg-white text-sm font-bold flex justify-between items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <span>{filters.specialization || 'Subject'}</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        {filters.openDropdown === "subject" && (
                            <div className="absolute bg-white border border-[#5186cd]/20 shadow-xl rounded-2xl p-3 mt-3 w-48 z-30 max-h-52 overflow-y-auto">
                                {SUBJECTS.map(subj => (
                                    <div
                                        key={subj}
                                        onClick={() =>
                                            setFilters((p: any) => ({
                                                ...p,
                                                specialization: subj,
                                                openDropdown: null
                                            }))
                                        }
                                        className="cursor-pointer px-3 py-2 hover:bg-[#e9f1fb] rounded-lg text-sm font-medium"
                                    >
                                        {subj}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {learningType === 'hobby' && (
                    <div className="relative p-4 rounded-2xl bg-white border border-[#5186cd]/20 shadow-sm">
                        <label className="text-sm font-bold text-[#5186cd] flex items-center"><Dot className='text-blue-600 w-7 h-7 -mt-1 '/>All Hobbies</label>

                        <button
                            onClick={() =>
                                setFilters((p: any) => ({
                                    ...p,
                                    openDropdown: p.openDropdown === "hobby" ? null : "hobby"
                                }))
                            }
                            className="w-full mt-3 px-4 py-2 border-2 border-black rounded-full bg-white text-sm font-bold flex justify-between items-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        >
                            <span>{filters.hobby || 'Hobby'}</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        {filters.openDropdown === "hobby" && (
                            <div className="absolute bg-white border border-[#5186cd]/20 shadow-xl rounded-2xl p-3 mt-3 w-48 z-30 max-h-52 overflow-y-auto">
                                {HOBBIES.map(h => (
                                    <div
                                        key={h}
                                        onClick={() =>
                                            setFilters((p: any) => ({
                                                ...p,
                                                hobby: h,
                                                openDropdown: null
                                            }))
                                        }
                                        className="cursor-pointer px-3 py-2 hover:bg-[#e9f1fb] rounded-lg text-sm font-medium"
                                    >
                                        {h}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Book Session Type */}
                <div onMouseDown={closeAllDropdowns} className="p-4 rounded-2xl bg-white border border-[#5186cd]/20 ">
                    <label className="text-base font-bold text-slate-700 flex"><Dot className='text-blue-600 w-7 h-7 -mt-1'/>Book Session</label>
                    <select 
                        value={filters.sessionType || ''} 
                        onChange={e => setFilters((p: any) => ({ ...p, sessionType: e.target.value, openDropdown: null }))} 
                        className="w-full mt-2 px-4 py-2 border-2 border-black rounded-full bg-white text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <option value="">Any</option>
                        <option value="group">Group Session</option>
                        <option value="private">1:1 Private Room</option>
                    </select>
                </div>

                {/* Experience */}
                <div onMouseDown={closeAllDropdowns} className="p-4 rounded-2xl bg-white border border-[#5186cd]/20 shadow-sm">
                    <label className="text-base font-semibold text-slate-700 flex"><Dot className='text-blue-600 w-7 h-7 -mt-1'/> Experience (yrs)</label>
                    <select
                        value={filters.experience}
                        onFocus={() =>
                            setFilters((p: any) => ({
                                ...p,
                                openDropdown: null
                            }))
                        }
                        onChange={e =>
                            setFilters((p: any) => ({
                                ...p,
                                experience: e.target.value
                            }))
                        }
                        className="w-full mt-2 px-4 py-2 border-2 border-black rounded-full bg-white text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <option value="0">0</option>
                        <option value="2">2</option>
                        <option value="5">5+</option>
                        <option value="10">10+</option>
                    </select>
                </div>

                {/* Rating */}
                {/* <div className="p-3 rounded-xl shadow-sm bg-[#6b48af] ">
                <label className="text-base font-semibold text-white">Rating</label>
                <select value={filters.rating} onChange={e => setFilters((p: any) => ({ ...p, rating: e.target.value }))} className="w-full mt-1 px-2 py-2 border bg-[#CBE56A] rounded-lg text-base font-semibold ">
                    <option value="">Any</option>
                    <option value="4.5">4.5+</option>
                    <option value="4.0">4.0+</option>
                    <option value="3.5">3.5+</option>
                </select>
            </div> */}

                {/* Sort By */}
                <div onMouseDown={closeAllDropdowns} className="p-4 rounded-2xl bg-white border border-[#5186cd]/20 shadow-sm">
                    <label className="text-base font-bold text-slate-700 flex"><Dot className='text-blue-600 w-7 h-7 -mt-1'/>Sort By</label>
                    <select value={filters.sortBy} onChange={e => setFilters((p: any) => ({ ...p, sortBy: e.target.value, openDropdown: null }))} className="w-full mt-2 px-4 py-2 border-2 border-black rounded-full bg-white text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                        <option value="rating">Highest Rated</option>
                        <option value="price_low">Price: Low → High</option>
                        <option value="price_high">Price: High → Low</option>
                        <option value="experience">Most Experienced</option>
                    </select>
                </div>

                {/* Removed min, only Max Price */}
                {/* <div onMouseDown={closeAllDropdowns} className="p-4 rounded-2xl bg-white border border-[#5186cd]/20 shadow-sm">
                    <label className="text-base font-bold text-slate-700">Sort Price ($/hr)</label>
                    <div className="flex items-center gap-2 mt-1 "> */}
                        {/* <input type="number" value={filters.minRate} onChange={e => setFilters((p: any) => ({ ...p, minRate: e.target.value }))} className="w-1/2 px-2 py-2 border border-gray-300 bg-[#CBE56A] rounded-lg text-sm text-[#2D274B] font-semibold" placeholder="Min" /> */}
                        {/* removed 2D274B */}
                        {/* <input type="number" value={filters.maxRate} onChange={e => setFilters((p: any) => ({ ...p, maxRate: e.target.value, openDropdown: null }))} className="w-full mt-2 px-4 py-2 border-2 border-black rounded-full bg-white text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" placeholder="Max" />
                    </div>
                </div> */}


                {/* Nationality */}
                {/* <div className="relative p-3 rounded-xl shadow-sm bg-[#6b48af]">
                <label className="text-base font-bold text-white">Nationality</label>
                <button onClick={() => setFilters((p: any) => ({ ...p, _toggleNationality: !p._toggleNationality }))} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-[#CBE56A] text-sm font-semibold flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        {filters.nationality ? (
                            <>
                                {renderFlag(filters.nationality)}
                                {COUNTRIES.find(c => c.code === filters.nationality)?.name || filters.nationality}
                            </>
                        ) : (
                            'Select Nationality'
                        )}
                    </span>
                    <ChevronDown className={`h-4 w-4 ${filters._toggleNationality ? 'rotate-180' : ''}`} />
                </button>
                {filters._toggleNationality && (
                    <div className="absolute bg-white shadow-xl rounded-xl p-3 mt-2 w-48 z-30 max-h-48 overflow-y-auto">
                        <input
                            type="text"
                            placeholder="Search countries..."
                            value={filters._nationalitySearch || ''}
                            onChange={(e) => setFilters((p: any) => ({ ...p, _nationalitySearch: e.target.value }))}
                            className="w-full px-2 py-1 border border-gray-300 rounded mb-2 text-sm"
                        />
                        {COUNTRIES.filter(country => 
                            country.name.toLowerCase().includes((filters._nationalitySearch || '').toLowerCase())
                        ).map(country => (
                            <div
                                key={country.code}
                                onClick={() => setFilters((p: any) => ({
                                    ...p,
                                    nationality: country.code,
                                    _toggleNationality: false,
                                    _nationalitySearch: ''
                                }))}
                                className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded flex items-center gap-2 text-sm"
                            >
                                {renderFlag(country.code)}
                                <span>{country.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}
            </div>
        </div>
    )
}


export default React.memo(FiltersPanel)