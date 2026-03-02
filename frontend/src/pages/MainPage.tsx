// FILE: src/pages/MainPage.tsx
import React, { useState, useCallback, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { motion } from 'framer-motion'
import Footer from '../components/Footer'
// import bg_img from '../assets/bg_main.jpeg'
// import logo from '../assets/header_logo.jpeg'
import SearchBar from '../components/SearchBar'
import LearningTypeSelector from '../components/LearningTypeSelector'
import FiltersPanel from '../components/FiltersPanel'
import TrainersGrid from '../components/TrainersGrid'
import { useAuth } from '../contexts/AuthContext'
// import CurrencySelector from '../components/CurrencySelector'
// import { Button, Offcanvas, Nav } from 'react-bootstrap'
import Navbar from '../components/Navbar'
import { useSearchParams } from 'react-router-dom'


const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [learningType, setLearningType] = useState<'language' | 'subject' | 'hobby'>('language')
  const [languageMode, setLanguageMode] = useState<string>('subject')
  const [searchParams] = useSearchParams();

  // const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const typeParam = searchParams.get('type');
    const subjectParam = searchParams.get('subject');
    const languageParam = searchParams.get('language');
    const hobbyParam = searchParams.get('hobby');

    if (typeParam === 'subject' && subjectParam) {
      setLearningType('subject');
      setFilters((prev: any) => ({
        ...prev,
        specialization: subjectParam,
        language: '', 
        hobby: ''
      }));
    } 
    else if (typeParam === 'language' && languageParam) {
      setLearningType('language');
      setFilters((prev: any) => ({
        ...prev,
        language: languageParam,
        specialization: '',
        hobby: ''
      }));
    } 
    else if (typeParam === 'hobby' && hobbyParam) {
      setLearningType('hobby');
      setFilters((prev: any) => ({
        ...prev,
        hobby: hobbyParam,
        language: '',
        specialization: ''
      }));
    }
  }, [searchParams]);

  const { user, loading } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/login";

    const role = user.role.toLowerCase();

    if (role === "student") return "/student";
    if (role === "trainer") return "/trainer";
    if (role === "admin") return "/admin";

    return "/main"; // fallback
  };

  const [nationalities, setNationalities] = useState<string[]>([])


  const [filters, setFilters] = useState<any>({
    language: '',
    specialization: '',
    hobby: '',
    minRate: '',
    maxRate: '',
    experience: '',
    rating: '',
    sortBy: 'rating',
    nationality: '',
    sessionType: '',
    openDropdown: null
  })


  const clearFilters = useCallback(() => {
    setFilters({
      language: '',
      specialization: '',
      hobby: '',
      minRate: '',
      maxRate: '',
      experience: '',
      rating: '',
      sortBy: 'rating',
      nationality: '',
      openDropdown: null
    })
    setSearchTerm('')
  }, [])


  return (
    <>
      <div className="min-h-screen bg-fixed  text-[#2D274B]">


        {/* Floating decorative orbs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-28 h-28 rounded-full" style={{ background: '#5186cd', opacity: 0.46, animation: 'floaty 6s ease-in-out infinite' }} />
          <div className="absolute top-40 right-20 w-20 h-20 rounded-full" style={{ background: '#5186cd', opacity: 0.66, animation: 'floaty 6s ease-in-out infinite', animationDelay: '1.8s' }} />
        </div>

        {/* Header */}
        <Navbar variant="main" />

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Hero */}
          <section className="pt-10 pb-16 px-6 text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 rounded-full bg-white text-[#5186cd] font-bold shadow border border-[#5186cd]/20">
              🤝 A Global Community of Learners & Mentors
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#1f2937]">
              Find Your <span className="text-[#5186cd]">Perfect Trainer</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto text-gray-700">
              Connect with expert trainers from around the world and begin your learning journey today.
            </p>
          </section>

          {/* Search */}
          <div className="flex justify-center mb-10">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>


          {/* Learning Type Selector + Filters */}
          <div className="max-w-6xl mx-auto mb-10 px-4">
            <div className="flex justify-center mb-6 w-full">
              <LearningTypeSelector learningType={learningType} onChange={(t) => {
                setLearningType(t)
                // reset fields relevant to other types
                setFilters((prev: any) => ({ ...prev, language: '', specialization: '', hobby: '' }))
                setLanguageMode('subject')
              }} />
            </div>

            <FiltersPanel learningType={learningType} filters={filters} setFilters={setFilters} nationalities={nationalities} clearFilters={clearFilters} />

          </div>


          {/* Trainers Grid (fetching + pagination inside) */}
          <TrainersGrid searchTerm={searchTerm} filters={filters} learningType={learningType} setNationalities={setNationalities} />


        </main>

      </div>
      <Footer />
    </>
  )
}


export default MainPage