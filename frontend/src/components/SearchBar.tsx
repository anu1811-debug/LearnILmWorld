import React from 'react'
import { Search } from 'lucide-react'

interface Props {
    value: string
    onChange: (v: string) => void
}

const SearchBar: React.FC<Props> = React.memo(({ value, onChange }) => {
    return (
        <div className="w-full max-w-4xl">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a56ad] h-5 w-5" />

                <input
                    type="text"
                    placeholder="Search trainers by name, language, or specialization..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="
            w-full pl-12 pr-5 py-4
            bg-white
            rounded-full
            border-2 border-[#5186cd]/25
            shadow-sm
            text-lg
            text-[#1f2937]
            placeholder-gray-500
            focus:outline-none
            focus:ring-2 focus:ring-[#5186cd]/40
            focus:border-[#5186cd]
            transition
          "
                />
            </div>
        </div>
    )
})

export default SearchBar