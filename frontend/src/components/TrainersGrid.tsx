// FILE: src/components/TrainersGrid.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import TrainerCard from './TrainerCard'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface Trainer { _id: string }

interface Props {
    searchTerm: string
    filters: any
    learningType: string
    setNationalities: (list: string[]) => void
}

const TrainersGrid: React.FC<Props> = ({ searchTerm, filters, learningType, setNationalities }) => {
    const loadMoreRef = useRef<HTMLDivElement | null>(null)
    const [trainers, setTrainers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [allNationalities, setAllNationalities] = useState<string[]>([])
    const rawFilter = filters.bookSession || filters.sessionType || '';
    const sessionMode = String(rawFilter).toLowerCase().includes('group') ? 'group' : 'private';

    useEffect(() => {
        setPage(1)
        setHasMore(true)
        setTrainers([])
    }, [JSON.stringify({
        language: filters.language || '',
        specialization: filters.specialization || '',
        hobby: filters.hobby || '',
        minRate: filters.minRate || '',
        maxRate: filters.maxRate || '',
        experience: filters.experience || '0',
        rating: filters.rating || '',
        sortBy: filters.sortBy || 'rating',
        nationality: filters.nationality || '',
        bookSession: filters.bookSession || '',
        sessionType: filters.sessionType || '' //for group or private session
    }), searchTerm, learningType])

    const buildQueryParams = useCallback(() => {
        const params: any = { page, limit: 6 }
        if (filters.language?.trim()) params.language = filters.language
        if (filters.specialization?.trim()) params.specialization = filters.specialization
        if (filters.hobby?.trim()) params.specialization = filters.hobby
        if (filters.minRate?.trim()) params.minRate = filters.minRate
        if (filters.maxRate?.trim()) params.maxRate = filters.maxRate
        if (filters.experience && filters.experience !== '0') params.experience = filters.experience
        if (filters.rating?.trim()) params.rating = filters.rating
        if (filters.sortBy && filters.sortBy !== 'rating') params.sortBy = filters.sortBy
        if (searchTerm?.trim()) params.search = searchTerm
        if (filters.sessionType && filters.sessionType !== 'any') {
            params.bookingType = filters.sessionType; 
        }
        return params
    }, [filters, searchTerm, page])

    useEffect(() => {
        let mounted = true
        const fetchData = async () => {
            page === 1 ? setLoading(true) : setLoadingMore(true)

            try {
                const params = buildQueryParams()
                const res = await axios.get(`${API_BASE_URL}/api/users/trainers`, { params })
                const list = res.data.trainers || []

                let verified = list.filter((t: any) => t?.profile?.verificationStatus === 'verified')

                const currentNationalities = Array.from(
                    new Set(verified.map((t: any) => t.profile?.nationalityCode).filter(Boolean))
                ) as string[]

                setAllNationalities(prev => {
                    const combined = [...prev, ...currentNationalities]
                    const uniqueNationalities = Array.from(new Set(combined))
                    setNationalities(uniqueNationalities)
                    return uniqueNationalities
                })

                if (learningType === 'subject') {
                    verified = verified.filter((t: any) =>
                        Array.isArray(t.profile?.specializations) && t.profile.specializations.length > 0
                    )
                }

                if (learningType === 'hobby') {
                    verified = verified.filter((t: any) => {
                        const hobbies = t.profile?.hobbies || t.profile?.interests || t.profile?.skills
                        return Array.isArray(hobbies) && hobbies.length > 0
                    })
                }

                if (learningType === 'language') {
                    verified = verified.filter((t: any) => {
                        // Check both 'languages' and 'trainerLanguages' just to be safe based on your User model
                        const langs = t.profile?.languages ;
                        return Array.isArray(langs) && langs.length > 0;
                    })
                }

                if (filters.nationality?.trim()) {
                    verified = verified.filter((t: any) => t.profile?.nationalityCode === filters.nationality)
                }

                const countsRes = await axios.get(`${API_BASE_URL}/api/reviews/counts`)
                const counts = countsRes.data || {}
                const merged = verified.map((t: any) => ({
                    ...t,
                    profile: { ...t.profile, totalBookings: counts[t._id] || 0 }
                }))

                if (mounted) {
                    setTrainers(prev => {
                        if (page === 1) return merged
                        const existingIds = new Set(prev.map(t => t._id))
                        const newTrainers = merged.filter((t: any) => !existingIds.has(t._id))
                        return [...prev, ...newTrainers]
                    })
                    setHasMore(list.length === 6)
                }
            } catch (err) {
                console.error('Trainers fetch failed', err)
                if (mounted && page === 1) setTrainers([])
            } finally {
                if (mounted) {
                    setLoading(false)
                    setLoadingMore(false)
                }
            }
        }

        fetchData()
        return () => { mounted = false }
    }, [buildQueryParams, page])

    useEffect(() => {
        if (!loadMoreRef.current || !hasMore || loadingMore) return
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0]
                if (first.isIntersecting && !loadingMore && hasMore) setPage(p => p + 1)
            },
            { threshold: 0.1, rootMargin: "50px" }
        )
        observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [loadingMore, hasMore])

    if (loading && page === 1) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-3 text-[#5186cd] text-xl font-bold mb-4">
                    <span className="animate-pulse">Loading verified trainers</span>
                    <span className="animate-pulse">…</span>
                </div>

                <div className="flex gap-2 mt-2">
                    <span className="w-3 h-3 bg-[#5186cd] rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-3 h-3 bg-[#5186cd] rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-3 h-3 bg-[#5186cd] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
            </div>
        )
    }

    return (
        <section className="mt-16">

            {/* Results Header */}
            <div className="mb-10 text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2937]">
                    {trainers.length} <span className="text-[#5186cd]">Verified Trainers</span> Available
                </h2>
                <p className="text-gray-600 mt-1">
                    Explore expert mentors ready to guide your learning
                </p>
            </div>


            {/* Trainers Grid */}
            <div className="grid gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {trainers.map((t, idx) => (
                    <TrainerCard key={t._id || idx} trainer={t} learningType={learningType} sessionMode={sessionMode} />
                ))}
            </div>

            {/* Infinite Scroll Loader */}
            <div ref={loadMoreRef} className="h-16 flex items-center justify-center">
                {loadingMore && (
                    <div className="flex items-center gap-3 text-[#5186cd] font-semibold">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#5186cd]"></div>
                        Loading more trainers...
                    </div>
                )}
            </div>

            {/* Manual Load More */}
            {!loadingMore && hasMore && (
                <div className="text-center mt-10">
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-8 py-4 bg-[#5186cd] text-white rounded-full font-bold shadow hover:bg-[#3f6fb0] hover:scale-105 transition"
                    >
                        Load More Trainers →
                    </button>
                </div>
            )}

            {/* Empty State */}
            {trainers.length === 0 && !loading && (
                <div className="text-center py-20">
                    <div className="w-24 h-24 bg-[#e9f1fb] rounded-full flex items-center justify-center mx-auto mb-6 text-[#5186cd] text-3xl">
                        😕
                    </div>
                    <h3 className="text-2xl font-bold text-[#1f2937] mb-3">No trainers found</h3>
                    <p className="text-gray-700">Try adjusting your search criteria or filters</p>
                </div>
            )}
        </section>
    )
}

export default TrainersGrid
