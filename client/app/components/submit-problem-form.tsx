"use client"

import { useState } from "react"
import { Plus, X, MapPin, FileText, Loader2, Hammer, Trash2, ShieldAlert, HelpCircle, Search, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"

interface SubmitProblemFormProps {
  onSuccess?: () => void
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

const categories = [
  { value: "infrastructure", label: "Infrastructure", icon: Hammer, gradient: "from-blue-500 to-cyan-500", ring: "ring-blue-500" },
  { value: "sanitation", label: "Sanitation", icon: Trash2, gradient: "from-emerald-500 to-green-500", ring: "ring-emerald-500" },
  { value: "safety", label: "Safety", icon: ShieldAlert, gradient: "from-red-500 to-rose-500", ring: "ring-red-500" },
  { value: "other", label: "Other", icon: HelpCircle, gradient: "from-gray-500 to-gray-600", ring: "ring-gray-500" },
] as const

export function SubmitProblemForm({ onSuccess, isOpen, onClose }: SubmitProblemFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [locationText, setLocationText] = useState("")
  const [category, setCategory] = useState<string>("other")
  const [customCategory, setCustomCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!locationText.trim()) return
    
    setIsSearching(true)
    setSearchResults([])
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationText)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (err) {
      console.error("Failed to search location", err)
    } finally {
      setIsSearching(false)
    }
  }

  const selectLocation = (result: SearchResult) => {
    setLocationText(result.display_name)
    setCoordinates({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon)
    })
    setSearchResults([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          locationText,
          category: category === "other" ? customCategory : category,
          latitude: coordinates?.lat,
          longitude: coordinates?.lon,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit problem")
      }

      onClose()
      setTitle("")
      setDescription("")
      setLocationText("")
      setCoordinates(null)
      setCategory("other")
      setCustomCategory("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit problem")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full max-w-lg z-10"
            >
              <div className="bg-white rounded-xl border border-[#E8E6E1] shadow-xl overflow-hidden">
                {/* Header */}
                <div className="relative px-6 py-5 border-b border-[#E8E6E1]">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 rounded-xl hover:bg-[#F5F3EE] transition-colors text-[#525252] hover:text-[#262626]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#2D5A47]/10 border border-[#2D5A47]/20">
                      <FileText className="w-5 h-5 text-[#2D5A47]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#262626]">Report a Problem</h2>
                      <p className="text-sm text-[#525252]">Help identify issues in your community</p>
                    </div>
                  </div>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-xs font-medium text-[#525252] mb-2 uppercase tracking-wider">
                        Problem Title
                      </label>
                      <input
                        id="title"
                        placeholder="e.g., Broken Street Light on Main St"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="geist-input"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-medium text-[#525252] mb-3 uppercase tracking-wider">
                        Category
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setCategory(cat.value)}
                            className={cn(
                              "flex items-center gap-3 p-4 rounded-xl border transition-all duration-200",
                              category === cat.value
                                ? `bg-gradient-to-br ${cat.gradient} border-transparent ring-2 ring-offset-2 ring-offset-white ${cat.ring}`
                                : "border-[#E8E6E1] bg-white hover:bg-[#F5F3EE] hover:border-[#D0CEC9]"
                            )}
                          >
                            <cat.icon className={cn(
                              "w-5 h-5",
                              category === cat.value ? "text-white" : "text-[#525252]"
                            )} />
                            <span className={cn(
                              "text-sm font-medium",
                              category === cat.value ? "text-white" : "text-[#262626]"
                            )}>
                              {cat.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      
                      <AnimatePresence>
                        {category === "other" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            <input
                              placeholder="Specify category..."
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              className="geist-input"
                              required
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Location */}
                    <div className="relative">
                      <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                        <MapPin className="w-3 h-3 inline-block mr-1" />
                        Location / Address
                      </label>
                      <div className="relative">
                        <input
                          placeholder="e.g., 123 Main St & 5th Ave"
                          value={locationText}
                          onChange={(e) => {
                            setLocationText(e.target.value)
                            setCoordinates(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleSearch()
                            }
                          }}
                          className="geist-input pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          disabled={isSearching || !locationText.trim()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.05] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Search Results */}
                      <AnimatePresence>
                        {searchResults.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-20 left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/[0.08] rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                          >
                            {searchResults.map((result) => (
                              <button
                                key={result.place_id}
                                type="button"
                                onClick={() => selectLocation(result)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-white/[0.05] hover:text-white border-b border-white/[0.04] last:border-0 transition-colors"
                              >
                                {result.display_name}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Coordinates Found */}
                      {coordinates && (
                        <p className="flex items-center gap-2 text-xs text-emerald-400 mt-2">
                          <Sparkles className="w-3 h-3" />
                          Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                        Description
                      </label>
                      <textarea
                        id="description"
                        placeholder="Describe the issue in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="geist-textarea"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-6 border-t border-white/[0.06] bg-white/[0.02]">
                    {error && (
                      <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={onClose} 
                        className="geist-button geist-button-secondary"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="geist-button-gradient px-6 h-10 rounded-xl font-medium flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Report"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
